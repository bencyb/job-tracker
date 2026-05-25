from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JobApplicationViewSet,
    JobNoteViewSet,
    JobStatsView,
    RegisterView,
    LogoutView,
    UpdateUsernameView,
    ChangePasswordView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    VerifyEmailView,
    UploadProfileImageView,
    UploadResumeView,
    DeleteResumeView,
    ResumeView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(
    r'applications',
    JobApplicationViewSet,
    basename='applications'
)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path("job/", JobStatsView.as_view(), name="job"),
    path(
        "update-username/",
        UpdateUsernameView.as_view(),
        name="update-username"
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password"
    ),
    path(
        "password-reset/",
        PasswordResetRequestView.as_view(),
        name="password-reset-request"
    ),
    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm"
    ),
    path(
        "verify-email/<uidb64>/<token>/",
        VerifyEmailView.as_view(),
        name="verify-email"
    ),
    path(
        "upload-profile-image/",
        UploadProfileImageView.as_view(),
        name="upload-profile-image"
    ),
    path(
        "upload-resume/",
        UploadResumeView.as_view(),
        name="upload-resume"
    ),
    path(
        "delete-resume/",
        DeleteResumeView.as_view(),
        name="delete-resume"
    ),
    path(
        "view-resume/",
        ResumeView.as_view(),
        name="view-resume"
    ),
    path(
        "job-notes/",
        JobNoteViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
    ),
    path(
        "job-notes/<int:pk>/",
        JobNoteViewSet.as_view({
            "delete": "destroy",
        }),
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout"
    ),

]
