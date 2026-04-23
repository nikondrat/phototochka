import json
import uuid

from django.db import transaction
from PIL import Image
from rest_framework import serializers
from django.contrib.auth import get_user_model

from . import media_constants as media_cfg
from .models import Category, Photo
from .tasks import process_photo_media

User = get_user_model()

class AuthorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="display_name")
    avatarUrl = serializers.ImageField(source="avatar")

    class Meta:
        model = User
        fields = ("id", "name", "avatarUrl")

class PhotoListSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="public_id", read_only=True)
    category = serializers.CharField(source="category.name")
    imageUrl = serializers.ImageField(source="image")
    imageWebp = serializers.ImageField(source="image_webp", read_only=True, allow_null=True)
    imageAvif = serializers.ImageField(source="image_avif", read_only=True, allow_null=True)
    blurHash = serializers.CharField(source="blur_hash", read_only=True, allow_blank=True)
    author = AuthorSerializer(read_only=True)
    uploadedAt = serializers.DateTimeField(source="uploaded_at")
    publicId = serializers.CharField(source="public_id")
    licenseTypes = serializers.JSONField(source="license_types")

    class Meta:
        model = Photo
        fields = (
            "id",
            "publicId",
            "title",
            "description",
            "category",
            "imageUrl",
            "imageWebp",
            "imageAvif",
            "blurHash",
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


class AuthorPhotoCreateSerializer(serializers.ModelSerializer):
    """Multipart: image + поля; tags и licenseTypes — JSON-строка или список через запятую."""

    category_slug = serializers.SlugField(write_only=True)
    tags = serializers.CharField(required=False, allow_blank=True, default="")
    license_types = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = Photo
        fields = (
            "title",
            "description",
            "image",
            "category_slug",
            "price",
            "tags",
            "license_types",
            "blur_hash",
        )
        extra_kwargs = {
            "description": {"required": False, "allow_blank": True},
            "price": {"required": False, "min_value": 0},
            "blur_hash": {"required": False, "allow_blank": True, "max_length": 64},
        }

    def validate_image(self, image):
        if image.size > media_cfg.MAX_PHOTO_UPLOAD_BYTES:
            raise serializers.ValidationError("Файл слишком крупный (максимум 10 МБ).")
        return image

    @staticmethod
    def _parse_tags(raw: str) -> list:
        raw = (raw or "").strip()
        if not raw:
            return []
        try:
            data = json.loads(raw)
            if isinstance(data, list):
                return [str(x) for x in data]
        except json.JSONDecodeError:
            pass
        return [t.strip() for t in raw.split(",") if t.strip()]

    @staticmethod
    def _parse_licenses(raw: str) -> list:
        raw = (raw or "").strip()
        if not raw:
            return ["personal"]
        try:
            data = json.loads(raw)
            if isinstance(data, list) and data:
                return [str(x) for x in data]
        except json.JSONDecodeError:
            return [s.strip() for s in raw.split(",") if s.strip()]
        return ["personal"]

    def create(self, validated_data):
        category_slug = validated_data.pop("category_slug")
        tags = self._parse_tags(validated_data.pop("tags", ""))
        license_types = self._parse_licenses(validated_data.pop("license_types", ""))
        blur = validated_data.pop("blur_hash", None)
        if blur is not None and blur == "":
            blur = None
        image = validated_data.pop("image")
        user = self.context["request"].user
        category = Category.objects.get(slug=category_slug)
        public_id = uuid.uuid4().hex[:16]

        image.seek(0)
        with Image.open(image) as im:
            w, h = im.size
        image.seek(0)
        if w > h * 1.05:
            orientation = Photo.Orientation.LANDSCAPE
        elif h > w * 1.05:
            orientation = Photo.Orientation.PORTRAIT
        else:
            orientation = Photo.Orientation.SQUARE

        photo = Photo(
            public_id=public_id,
            author=user,
            category=category,
            title=validated_data["title"],
            description=validated_data.get("description", ""),
            price=validated_data.get("price", 0) or 0,
            tags=tags,
            license_types=license_types,
            orientation=orientation,
            width=w,
            height=h,
        )
        if blur:
            photo.blur_hash = blur
        photo.image = image
        photo.save()

        def _queue():
            process_photo_media.delay(photo.id)

        transaction.on_commit(_queue)
        return photo
