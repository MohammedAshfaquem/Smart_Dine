# backend/project/smartdine/views.py
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes



from .serializers import StaffRegisterSerializer, StaffLoginSerializer
from .utils import send_verification_email  # you can implement a simple email sender

User = get_user_model()

# ---------------------------
# Register Staff
# ---------------------------
class StaffRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = StaffRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()

                # Attempt to send email, but do not fail registration if it fails
                try:
                    send_verification_email(user)
                except Exception as e:
                    print(f"Email sending failed: {e}")

                return Response(
                    {"success": True, "message": "Registered successfully! Please verify your email."},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # serializer errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ---------------------------
# Email Verification
# ---------------------------
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_staff_email(request, token):
    try:
        user = get_object_or_404(User, email_verification_token=token)
        
        if user.is_email_verified:
            return Response({"message": "Email verified successfully!"})
        
        user.is_email_verified = True
        user.is_active = True  
        user.save()
        
        return Response({"message": "Email verified successfully!"})
    
    except Exception as e:
        print("Error verifying email:", e)
        return Response({"message": "Invalid or expired token."}, status=400)


# ---------------------------
# Staff Login
# ---------------------------
class StaffLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = StaffLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user_id = data['user']['id']
        user = User.objects.get(id=user_id)

        if not user.is_email_verified:
            return Response({"error": "Email not verified."}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_approved_by_admin:
            return Response({"error": "Admin has not approved your account yet."}, status=status.HTTP_401_UNAUTHORIZED)
        if user.isBlocked:
            return Response({"error": "Your account is blocked."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(data, status=status.HTTP_200_OK)
