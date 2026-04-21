from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Photo, Category

User = get_user_model()

class AuthorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="display_name")
    avatarUrl = serializers.ImageField(source="avatar")

    class Meta:
        model = User
        fields = ("id", "name", "avatarUrl")

class PhotoListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    imageUrl = serializers.ImageField(source="image")
    author = AuthorSerializer(read_only=True)
    uploadedAt = serializers.DateTimeField(source="uploaded_at")
    publicId = serializers.CharField(source="public_id")
    licenseTypes = serializers.JSONField(source="license_types")

    class Meta:
        model = Photo
        fields = (
            "publicId",
            "title",
            "description",
            "category",
            "imageUrl",
            "orientation",
            "tags",
            "licenseTypes",
            "price",
            "author",
            "uploadedAt",
            "views",
            "downloads",
        )

class PhotoDetailSerializer(PhotoListSerializer):
    class Meta(PhotoListSerializer.Meta):
        fields = PhotoListSerializer.Meta.fields + ("width", "height")

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug")
