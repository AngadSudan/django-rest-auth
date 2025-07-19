from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Profile,Subscription
from .serializers import ProfileSerializer, UserSerializer
from django.contrib.auth import authenticate
from datetime import datetime
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny
from .util import send_custom_email
from random import random
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


OTP_MAP = {}


def generateOtp():
    return f"{int(random() * 1000000):06d}"

class RegisterView(APIView):
    authentication_classes = []     # disables default TokenAuthentication
    permission_classes = [AllowAny] # allows access to unauthenticated users
    def get(self, request):
        return Response({"message": "User registration API working"}, status=status.HTTP_200_OK)

    def post(self, request):
        # Use the flat request data directly for User creation
        user_serializer = UserSerializer(data=request.data)

        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = user_serializer.validated_data.get("email")

        if User.objects.filter(email=email).exists():
            return Response({"message": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Hash password manually and create user
        user = User.objects.create(
            username=user_serializer.validated_data.get("username"),
            email=email,
            password=make_password(user_serializer.validated_data.get("password"))
        )

        # Create profile with the created user
        profile = Profile.objects.create(user_id=user)

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    authentication_classes = []     # disables default TokenAuthentication
    permission_classes = [AllowAny] # allows access to unauthenticated users
    def get(self, request):
        return Response({"message": "User login API working"}, status=status.HTTP_200_OK)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"message": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user_auth = authenticate(username=user.username, password=password)
        if not user_auth:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_403_FORBIDDEN)

        # Update last login in Profile
        profile = user.profile
        profile.lastLoggedIn = datetime.now()
        profile.save()

        # Create or get token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "token": token.key
        }, status=status.HTTP_200_OK)

class UserProfile(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  
        try:
            profile = Profile.objects.get(user_id=user)
            
            # Get all Subscriptions bought by this Profile
            subscriptions = Subscription.objects.filter(bought_by=profile)

            data = {
                "username": user.username,
                "email": user.email,
                "profile": {
                    "lastLoggedIn": profile.lastLoggedIn,
                    "created_at": profile.created_at,
                    "subscription_id": str(profile.subscription_id.subscription_id) if profile.subscription_id else None,
                },
                "subscriptions": [
                    {
                        "subscription_id": str(sub.subscription_id),
                        "plan": sub.subscription_plan,
                        "amount": sub.amount,
                        "bought_date": sub.subscription_bought_date,
                        "expiry_date": sub.subscription_expiry_date,
                    }
                    for sub in subscriptions
                ]
            }
            return Response({"data": data}, status=status.HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class generateOTP(APIView):
    authentication_classes = []     # disables default TokenAuthentication
    permission_classes = [AllowAny] # allows access to unauthenticated users
    def post(self, request):
        user_email = request.data.get("email")

        if not user_email:
            return Response({"message": "Email is required."})

        try:
            db_user = Profile.objects.get(user_id__email=user_email)
        except Profile.DoesNotExist:
            return Response({"message": "No such email registered."})
        except Exception as e:
            print("Error fetching user:", e)
            return Response({"message": "Something went wrong."})

        # Generate OTP
        otp = generateOtp()

        OTP_MAP[user_email] = otp
        print("Generated OTP:", otp)

        html_message = f"""
        <html>
            <body>
                <h3>Password Reset OTP</h3>
                <p>Your OTP for password reset is:</p>
                <h2 style="color: #2c3e50;">{otp}</h2>
                <p>This OTP is valid for 10 minutes.</p>
                <p>If you did not request this, please ignore the email.</p>
                <br>
                <p>Thanks,<br>YourAppName Support Team</p>
            </body>
        </html>
        """

        try:
            send_custom_email(
                to_email=user_email,
                subject="Forgot Password - OTP Verification",
                body=html_message,
                html=True
            )
        except Exception as e:
            print("Email send error:", e)
            return Response({"message": "Error in sending OTP."})

        return Response({"message": "OTP sent successfully to your email."}, status=status.HTTP_200_OK)

class verifyOTP(APIView):
    authentication_classes = []     # disables default TokenAuthentication
    permission_classes = [AllowAny] # allows access to unauthenticated users
    def post(self,request):
        user_email = request.data.get('email')
        user_otp= request.data.get('otp')

        try:
            setOtp = OTP_MAP[user_email]
            if(setOtp==user_otp):
                return Response({"message":"user otp validated"})
            else:
                return Response({"message":"wrong otp entered"})
        except Exception as e:
            print(e)
            return Response({"message":"something went wrong"})

class resetPassword(APIView):
    authentication_classes = []      # disables default TokenAuthentication
    permission_classes = [AllowAny]  # allows access to unauthenticated users

    def post(self, request):
        user_email = request.data.get('email')
        new_password = request.data.get('password')

        # Basic validation
        if not user_email or not new_password:
            return Response(
                {"message": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return Response(
                {"message": "No user found with the provided email."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Set the new password securely
        user.set_password(new_password)
        user.save()

        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
        <style>
            body {{
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            }}
            .container {{
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            color: #333333;
            }}
            .header {{
            text-align: center;
            padding-bottom: 20px;
            }}
            .content {{
            line-height: 1.6;
            }}
            .footer {{
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
            text-align: center;
            }}
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h2>Password Changed</h2>
            </div>
            <div class="content">
            <p>Hello,</p>
            <p>This is a confirmation that the password for your account has been successfully changed.</p>
            <p>If you did not perform this action, please reset your password immediately or contact our support team.</p>
            <p>Thank you for using our services!</p>
            </div>
            <div class="footer">
            <p>YourAppName © 2025 | Support: support@yourapp.com</p>
            </div>
        </div>
        </body>
        </html>
        """

        try:
            send_custom_email(
                to_email=user_email,
                subject="Forgot Password - OTP Verification",
                body=html_message,
                html=True
            )
        except Exception as e:
            print("Email send error:", e)

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK
        )