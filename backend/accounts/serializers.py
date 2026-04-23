from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from . import constants
from .utils import generate_unique_username_from_email

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    dateJoined = serializers.DateTimeField(source="date_joined", read_only=True)
    totalViews = serializers.IntegerField(read_only=True, default=0)
    totalDownloads = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "role",
            "display_name",
            "avatar",
            "bio",
            "website",
            "instagram",
            "dateJoined",
            "totalViews",
            "totalDownloads",
        )
        read_only_fields = ("id", "role", "dateJoined", "totalViews", "totalDownloads")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=constants.MIN_PASSWORD_LENGTH,
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), lookup="iexact")],
    )

    class Meta:
        model = User
        fields = ("email", "password", "display_name")

    def create(self, validated_data):
        email = validated_data["email"]
        username = generate_unique_username_from_email(email)
        return User.objects.create_user(
            username=username,
            email=email,
            password=validated_data["password"],
            display_name=validated_data.get("display_name") or "",
        )


class IdentifierTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Тело запроса: { \"identifier\", \"password\" } — email или username."""

    identifier = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop("username", None)

    def validate(self, attrs):
        attrs["username"] = attrs.pop("identifier")
        return super().validate(attrs)
