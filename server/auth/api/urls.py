
from django.urls import include, path
from django.contrib import admin
from .payment import PaymentView , CallbackView
from .views import RegisterView, LoginView ,UserProfile,generateOTP,verifyOTP,resetPassword

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),              # ✅ Fixed
    path('login/', LoginView.as_view(), name='login'),                      # ✅ Fixed
    path('razorpay_order/', PaymentView.as_view(), name='razorpay_order'),
    path('razorpay_callback/', CallbackView.as_view(), name='razorpay_callback'),
    path('profile/', UserProfile.as_view(), name='user-profile'),
    path('otp/', generateOTP.as_view(), name='generate-otp'),
    path('verify_otp/', verifyOTP.as_view(), name='verify-otp'),
    path('reset-password/', resetPassword.as_view(), name='reset-password'),
]