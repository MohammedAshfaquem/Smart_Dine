from django.urls import path
from .views import (
    StaffRegisterView,
    StaffLoginView,
    VerifyStaffEmailView,
    RequestPasswordResetView,
    PasswordResetConfirmView,
    PendingUsersView,
    ApproveUserView,
    PendingRequestsCountView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('auth/staff/register/', StaffRegisterView.as_view(), name='staff-register'),
    path('auth/staff/login/', StaffLoginView.as_view(), name='staff-login'),
    path('auth/staff/verify-email/<str:token>/',VerifyStaffEmailView.as_view() , name='verify-email'),
    path('auth/staff/request-password-reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('auth/staff/reset-password/<int:user_id>/<str:token>/', PasswordResetConfirmView.as_view(), name='reset-password'),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('test/pending-users/',PendingUsersView.as_view(),name="pending-users"),
    path("api/admin/approve-user/<int:pk>/", ApproveUserView.as_view(), name="approve-user"),
    path("api/admin/pending-count/", PendingRequestsCountView.as_view(), name="pending_count"),

]
