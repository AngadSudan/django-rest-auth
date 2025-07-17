from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Profile
from .serializers import ProfileSerializer, UserSerializer
from django.contrib.auth import authenticate
from datetime import datetime
from django.contrib.auth.hashers import make_password
class RegisterView(APIView):
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
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
