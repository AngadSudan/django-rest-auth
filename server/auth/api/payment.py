import json
import os
import razorpay
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Subscription,Profile

class PaymentStatus:
    SUCCESS = "Success"
    FAILURE = "Failure"
    PENDING = "Pending"


# Get Razorpay Key id and secret for authorizing razorpay client.
RAZOR_KEY = os.getenv('RAZORPAY_KEY', None)
RAZOR_SECRET = os.getenv('RAZORPAY_SECRET', None)

# Creating a Razorpay Client instance.
razorpay_client = razorpay.Client(auth=("RAZOR_KEY", "RAZOR_SECRET"))


class PaymentView(APIView):
    http_method_names = ('post','get')
    def get(self,request):
        return Response({"message": "Payment apis working"}, status=status.HTTP_200_OK)
    @staticmethod
    def post(request, *args, **kwargs):

        # TODO: LEARN HOW TO TAKE THE DATA AND WORK ON IT
        # Create Order
        razorpay_order = razorpay_client.order.create(
            {"amount": int(amount) * 100, "currency": "INR", "payment_capture": "1"}
        )

        # Save the order in DB
        order = Subscription.objects.create(
            name=name, amount=amount, provider_order_id=razorpay_order["id"]
        )

        data = {
            "name" : name,
            "merchantId": "RAZOR_KEY",
            "amount": amount,
            "currency" : 'INR' ,
            "orderId" : razorpay_order["id"],
            }

        # save order Details to frontend
        return Response(data, status=status.HTTP_200_OK)

class CallbackView(APIView):
    
    """
    APIView for Verifying Razorpay Order.
    :return: Success and failure response messages
    """
    def get(self,request):
        return Response({"message": "Payment apis working"}, status=status.HTTP_200_OK)
    @staticmethod
    def post(request, *args, **kwargs):

        # getting data form request
        response = request.data.dict()

        if "razorpay_signature" in response:

            # Verifying Payment Signature
            data = razorpay_client.utility.verify_payment_signature(response)

            # if we get here True signature
            if data:
                payment_object = Subscription.objects.get(provider_order_id = response['razorpay_order_id'])                # razorpay_payment = RazorpayPayment.objects.get(order_id=response['razorpay_order_id'])
                payment_object.status = PaymentStatus.SUCCESS
                payment_object.payment_id = response['razorpay_payment_id']
                payment_object.signature_id = response['razorpay_signature']          
                payment_object.save()

                return Response({'status': 'Payment Done'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'Signature Mismatch!'}, status=status.HTTP_400_BAD_REQUEST)

        # Handling failed payments
        else:
            error_code = response['error[code]']
            error_description = response['error[description]']
            error_source = response['error[source]']
            error_reason = response['error[reason]']
            error_metadata = json.loads(response['error[metadata]'])
            razorpay_payment =   Subscription.objects.get(provider_order_id=error_metadata['order_id'])
            razorpay_payment.payment_id = error_metadata['payment_id']
            razorpay_payment.signature_id = "None"
            razorpay_payment.status = PaymentStatus.FAILURE
            razorpay_payment.save()

            error_status = {
                'error_code': error_code,
                'error_description': error_description,
                'error_source': error_source,
                'error_reason': error_reason,
            }

            return Response({'error_data': error_status}, status=status.HTTP_401_UNAUTHORIZED)