from rest_framework import serializers
from .models import JobApplication, JobNote
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value.lower()

    def create(self, validated_data):
        validated_data['email'] = validated_data['email'].lower()
        user = User.objects.create_user(**validated_data)
        user.is_active = False
        user.save()
        return user


class JobApplicationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username", read_only=True
    )

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ["user", "applied_date"]


class JobNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobNote
        fields = "__all__"
        read_only_fields = ["user"]
