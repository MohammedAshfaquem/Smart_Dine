# backend/project/smartdine/urls.py
from django.urls import path
from .views import StaffRegisterView, StaffLoginView, verify_staff_email

urlpatterns = [
    path('auth/staff/register/', StaffRegisterView.as_view(), name='staff-register'),
    path('auth/staff/login/', StaffLoginView.as_view(), name='staff-login'),
    path('auth/staff/verify-email/<str:token>/', verify_staff_email),
]
