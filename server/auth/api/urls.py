
from django.urls import include, path
from django.contrib import admin
from .payment import PaymentView , CallbackView
from .views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),              # ✅ Fixed
    path('login/', LoginView.as_view(), name='login'),                      # ✅ Fixed
    path('razorpay_order/', PaymentView.as_view(), name='razorpay_order'),
    path('razorpay_callback/', CallbackView.as_view(), name='razorpay_callback'),
]