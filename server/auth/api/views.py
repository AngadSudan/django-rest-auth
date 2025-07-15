from rest_framework.views import APIView
from rest_framework.response import Response
from serializers import UserSerializer

def generateAuthToken(id):
    return ""

class RegisterView(APIView):
    def post(self, request):
        # logic to register user
        return Response({"message": "User registered"})

class LoginView(APIView):
    def post(self, request):
        # logic to login user
        return Response({"message": "User logged in"})

class ForgotPassword(APIView):
    def post(self,request):
        return Response({"message":"random"})