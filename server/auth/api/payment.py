import json
import os
import razorpay
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Subscription,Profile
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
import traceback
from dotenv import load_dotenv
from django.contrib.auth.models import User

load_dotenv()
class PaymentStatus:
    SUCCESS = "Success"
    FAILURE = "Failure"
    PENDING = "Pending"


# Get Razorpay Key id and secret for authorizing razorpay client.
RAZOR_KEY = os.getenv('RAZORPAY_KEY', "rzp_test_tT1aQm39ql8XqR")
RAZOR_SECRET = os.getenv('RAZORPAY_SECRET', "4Sy6bTxG9vyyakut2dxqZSkr")
print(RAZOR_KEY,RAZOR_SECRET)

razorpay_client = razorpay.Client(auth=(RAZOR_KEY, RAZOR_SECRET))

planDictionary = {
    "premium":{
         "monthly": 4000,
        "yearly": 40000,
    },
    "pro":{
        "monthly": 8000,
        "yearly": 80000,
    }
}

class PaymentView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ('post', 'get')

    def get(self, request):
        return Response({"message": "Payment APIs working"}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            user = request.user  # DRF handles token from Authorization header

            req_data = request.data
            plan_type = req_data.get('planType')
            billing = req_data.get('billing')
            name = user.get_full_name() or user.username
            email = user.email


            if not plan_type or not billing:
                return Response({"error": "Missing planType or billing in request body."}, status=status.HTTP_400_BAD_REQUEST)

            amount = planDictionary[plan_type][billing]

            razorpay_order = razorpay_client.order.create({
                "amount": int(amount) * 100,
                "currency": "INR",
                "payment_capture": "1"
            })

            bought_date = timezone.now().date()
            expiry_date = bought_date + timedelta(days=30) if billing == "monthly" else bought_date + timedelta(days=365)

            

            return Response({
                "name": name,
                "email": email,
                "merchantId": "RAZOR_KEY",
                "amount": amount,
                "currency": "INR",
                "orderId": razorpay_order["id"],
            #    "subscriptionId": str(subscription.subscription_id),
                "validTill": expiry_date.isoformat()
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print("Exception occurred:", e)
            traceback.print_exc()  # This prints the complete traceback to console/log
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CallbackView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Payment APIs working"}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            response = request.data

            print("Callback payload:", response)

            user = request.user
            print(user)
            db_user = User.objects.get(username=user)
            print(db_user)
            db_profile = Profile.objects.get(user_id=db_user.pk)
            profile = db_profile  # one-to-one relationship, safe to use
            print(profile)
            if "razorpay_signature" in response:
                # --- Razorpay signature verification ---
                try:
                    razorpay_order_id = response['razorpay_order_id']
                    razorpay_payment_id = response['razorpay_payment_id']
                    razorpay_signature = response['razorpay_signature']

                    razorpay_client.utility.verify_payment_signature({
                        'razorpay_order_id': razorpay_order_id,
                        'razorpay_payment_id': razorpay_payment_id,
                        'razorpay_signature': razorpay_signature
                    })

                except razorpay.errors.SignatureVerificationError:
                    return Response({'status': 'Signature Mismatch!'}, status=status.HTTP_400_BAD_REQUEST)

                # Get plan details sent from frontend
                plan_type = response.get("planType")
                billing = response.get("billing")

                if not plan_type or not billing:
                    return Response({"error": "Missing planType or billing."}, status=status.HTTP_400_BAD_REQUEST)

                # Example pricing structure
                planDictionary = {
                    "basic": {"monthly": 100, "yearly": 1000},
                    "premium": {"monthly": 300, "yearly": 3000}
                }

                amount = planDictionary[plan_type][billing]
                bought_date = timezone.now().date()
                added_days = 30 if billing == "monthly" else 365

                # Calculate new expiry date
                if profile.subscription_id and profile.subscription_id.subscription_expiry_date >= bought_date:
                    expiry_date = profile.subscription_id.subscription_expiry_date + timedelta(days=added_days)
                else:
                    expiry_date = bought_date + timedelta(days=added_days)

                # Create new subscription
                new_subscription = Subscription.objects.create(
                    subscription_plan=f"{plan_type}-{billing}",
                    subscription_bought_date=bought_date,
                    amount=amount,
                    subscription_expiry_date=expiry_date,
                    bought_by=profile
                )
                #somehow get the email and send an email containing the invoice
                # Update profile with new subscription
                profile.subscription_id = new_subscription
                profile.save()

                return Response({
                    'status': 'Payment Success',
                    'subscriptionId': str(new_subscription.subscription_id),
                    'validTill': expiry_date.isoformat()
                }, status=status.HTTP_200_OK)

            else:
                # --- Handle payment failure ---
                error_code = request.data.get('error[code]')
                error_description = request.data.get('error[description]')
                error_source = request.data.get('error[source]')
                error_reason = request.data.get('error[reason]')
                error_metadata = json.loads(request.data.get('error[metadata]', '{}'))

                order_id = error_metadata.get('order_id')
                payment_id = error_metadata.get('payment_id')

                try:
                    failed_subscription = Subscription.objects.get(subscription_id=order_id)
                    failed_subscription.status = "FAILURE"  # Ensure `status` exists in your model
                    failed_subscription.save()
                except Subscription.DoesNotExist:
                    pass  # Graceful fallback

                return Response({
                    'status': 'Payment Failed',
                    'error': {
                        'code': error_code,
                        'description': error_description,
                        'source': error_source,
                        'reason': error_reason
                    }
                }, status=status.HTTP_402_PAYMENT_REQUIRED)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)