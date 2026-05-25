from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import JobApplication, JobNote, Profile
from .serializers import (
    JobApplicationSerializer,
    RegisterSerializer,
)
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.contrib.auth.password_validation import (
    validate_password,
    get_password_validators,
)
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.urls import reverse
from django_rest_passwordreset.models import ResetPasswordToken
from django.utils import timezone
from datetime import timedelta
from django.conf import settings


User = get_user_model()


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    queryset = JobApplication.objects.all()

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def send_verification_email(user, request):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    frontend_base = getattr(settings, 'FRONTEND_URL', None)
    if frontend_base:
        verification_url = (
            f"{frontend_base.rstrip('/')}"
            f"/verify-email/{uidb64}/{token}/"
        )
    else:
        verification_url = request.build_absolute_uri(
            reverse('verify-email', args=[uidb64, token])
        )

    subject = 'Verify your Job Tracker account'
    message = (
        f'Hi {user.username},\n\n'
        f'Please verify your account by clicking the link below:\n\n'
        f'{verification_url}\n\n'
        'If you did not register for this account, please ignore this email.\n'
    )
    user.email_user(subject, message, from_email=settings.DEFAULT_FROM_EMAIL)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_verification_email(user, request)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'message': (
                    'Registration successful. Check your email to verify your '
                    'account.'
                )
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class VerifyEmailView(APIView):
    permission_classes = ()

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is None:
            return Response(
                {'error': 'Invalid verification link.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_active:
            return Response({'message': 'Account already verified.'})

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(
                {'message': 'Email verified successfully. You can now log in.'}
            )

        return Response(
            {'error': 'Invalid or expired verification link.'},
            status=status.HTTP_400_BAD_REQUEST
        )


class JobStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        applied = JobApplication.objects.filter(
            user=user,
            status="Applied"
        ).count()
        interview = JobApplication.objects.filter(
            user=user,
            status="Interview"
        ).count()
        offer = JobApplication.objects.filter(
            user=user,
            status="Offer"
        ).count()
        rejected = JobApplication.objects.filter(
            user=user,
            status="Rejected"
        ).count()
        return Response({
            "applied": applied,
            "interview": interview,
            "offer": offer,
            "rejected": rejected,
        })


class UpdateUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        username = request.data.get("username")

        # Validation
        if not username:
            return Response(
                {"error": "Username is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check duplicate username
        if User.objects.filter(username=username).exclude(id=user.id).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.username = username
        user.save()

        return Response({
            "message": "Username updated successfully",
            "username": user.username,
            "email": user.email,
            "profile_image": getattr(user, "profile_image", None),
        })


class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        old_password = request.data.get(
            "old_password"
        )
        new_password = request.data.get(
            "new_password"
        )
        # Validation
        if not old_password or not new_password:
            return Response(
                {
                    "error":
                    "All fields are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # Check old password
        if not user.check_password(
            old_password
        ):
            return Response(
                {
                    "error":
                    "Old password is incorrect"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # Password length validation
        if len(new_password) < 6:
            return Response(
                {
                    "error":
                    "Password must be at least 6 characters"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # Set new password
        user.set_password(new_password)
        user.save()
        return Response({
            "message":
            "Password changed successfully"
        })


class PasswordResetRequestView(APIView):
    permission_classes = ()

    def post(self, request):
        identifier = request.data.get("identifier")

        if not identifier:
            return Response(
                {"error": "Username or email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        users = User.objects.filter(
            Q(username__iexact=identifier) | Q(email__iexact=identifier)
        )

        if not users.exists():
            return Response(
                {
                    "message": (
                        "If an account exists, a password reset token "
                        "has been generated."
                    )
                }
            )

        user = users.filter(is_active=True).first()

        if not user:
            return Response(
                {
                    "message": (
                        "If an account exists, a password reset token "
                        "has been generated."
                    )
                }
            )

        # Check if eligible_for_reset method exists.
        # If it does not exist, assume active users are eligible.
        try:
            if not user.eligible_for_reset():
                return Response(
                    {
                        "message": (
                            "If an account exists, a password reset token "
                            "has been generated."
                        )
                    }
                )
        except AttributeError:
            pass  # Method doesn't exist, user is eligible

        token_expiry_hours = getattr(
            settings,
            'DJANGO_REST_MULTITOKENAUTH_RESET_TOKEN_EXPIRY_TIME',
            24
        )
        cutoff = timezone.now() - timedelta(hours=token_expiry_hours)
        ResetPasswordToken.objects.filter(
            user=user,
            created_at__lte=cutoff
        ).delete()

        # Try to get existing token using different possible reverse relations
        token = None
        try:
            token = user.password_reset_tokens.first()
        except AttributeError:
            token = ResetPasswordToken.objects.filter(user=user).first()

        if not token:
            token = ResetPasswordToken.objects.create(
                user=user,
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                ip_address=request.META.get("REMOTE_ADDR", "")
            )

        return Response({
            "message": "Password reset token generated successfully.",
            "token": token.key,
        })


class PasswordResetConfirmView(APIView):
    permission_classes = ()

    def post(self, request):
        token = request.data.get("token", "").strip()
        password = request.data.get("password", "").strip()

        if not token or not password:
            return Response(
                {"error": "Token and new password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {
                    "error":
                    "Password must be at least 6 characters long."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Query by key field (only valid field in ResetPasswordToken model)
        reset_password_token = ResetPasswordToken.objects.filter(
            key=token
        ).first()

        if not reset_password_token:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        expiry_hours = getattr(
            settings,
            'DJANGO_REST_MULTITOKENAUTH_RESET_TOKEN_EXPIRY_TIME',
            24
        )
        expiry_date = (
            reset_password_token.created_at + timedelta(hours=expiry_hours)
        )

        if timezone.now() > expiry_date:
            reset_password_token.delete()
            return Response(
                {"error": "Token has expired."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = reset_password_token.user

        # Check if eligible_for_reset method exists
        try:
            if not user.eligible_for_reset():
                return Response(
                    {"error": "Cannot reset password for this account."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except AttributeError:
            pass  # Method doesn't exist, user is eligible

        try:
            validate_password(
                password,
                user=user,
                password_validators=get_password_validators(
                    settings.AUTH_PASSWORD_VALIDATORS
                )
            )
        except ValidationError as e:
            print(f"DEBUG: Password validation error: {e.messages}")
            return Response(
                {"error": e.messages},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()
        ResetPasswordToken.objects.filter(user=user).delete()

        return Response({
            "message": "Password has been reset successfully."
        })


class UploadProfileImageView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        image = request.FILES.get(
            "profile_image"
        )
        if not image:
            return Response(
                {
                    "error":
                    "No image uploaded"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.profile_image = image
        profile.save()

        profile_url = None
        if profile.profile_image:
            profile_url = request.build_absolute_uri(profile.profile_image.url)

        return Response({
            "message": "Profile image updated",
            "profile_image": profile_url,
        })


class UploadResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        resume = request.FILES.get("resume")

        if not resume:
            return Response(
                {
                    "error":
                    "No resume uploaded"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate PDF
        if not resume.name.endswith(".pdf"):
            return Response(
                {
                    "error":
                    "Only PDF files allowed"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.resume = resume
        profile.save()
        return Response({
            "message": "Resume uploaded successfully",
            "resume":   request.build_absolute_uri(
                profile.resume.url
            )
        })


class DeleteResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        profile, _ = Profile.objects.get_or_create(
            user=request.user
        )

        if not profile.resume:
            return Response(
                {"error": "No resume to delete"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.resume.delete(save=False)
        profile.resume = None
        profile.save()

        return Response({
            "message": "Resume deleted successfully"
        })


class ResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)

        if not profile.resume:
            return Response(
                {"error": "No resume uploaded"},
                status=status.HTTP_404_NOT_FOUND
            )

        resume_url = request.build_absolute_uri(profile.resume.url)
        return Response({
            "resume": resume_url
        })


class JobNoteViewSet(viewsets.ViewSet):

    permission_classes = [IsAuthenticated]

    def list(self, request):

        notes = JobNote.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serialized_notes = [
            {
                "id": note.id,
                "note": note.note,
                "created_at": note.created_at
            }
            for note in notes
        ]

        return Response(serialized_notes)

    def create(self, request):

        note = request.data.get("note")

        if not note:
            return Response(
                {"error": "Note content is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        job_note = JobNote.objects.create(
            user=request.user,
            note=note
        )

        return Response({
            "id": job_note.id,
            "note": job_note.note,
            "created_at": job_note.created_at
        })

    def destroy(self, request, pk=None):

        try:

            note = JobNote.objects.get(
                id=pk,
                user=request.user
            )

            note.delete()

            return Response({
                "message": "Note deleted"
            })

        except JobNote.DoesNotExist:

            return Response(
                {"error": "Note not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)

            # Blacklist token
            token.blacklist()
            return Response({
                "message":
                "Logout successful"
            })
        except Exception:
            return Response(
                {
                    "error":
                    "Invalid token"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
