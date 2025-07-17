from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Subscription,User
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password
from datetime import date
def generateAuthToken(id):
    return ""

class RegisterView(APIView):
    def get(self,request):
        return Response({"message": "User registeration apis working"}, status=status.HTTP_200_OK)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Check if user with email already exists
            if User.objects.filter(email=serializer.validated_data['email']).exists():
                return Response({"message": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def get(self,request):
        return Response({"message": "User login apis working"}, status=status.HTTP_200_OK)
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"message": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not check_password(password, user.password):
            return Response({"message": "Invalid credentials"}, status=status.HTTP_403_FORBIDDEN)

        # Get or create token
        user.save(commit=False)
        user.lastLoggedIn = date.today()
        user.save()
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "token": token.key
        }, status=status.HTTP_200_OK)


class UserProfile(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            #TODO: fetch user data
            print()
        else:
            return Response({"message":"internal server error"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)