from django.conf import settings
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Orientation(models.Model):
    name = models.CharField(max_length=64, unique=True)
    slug = models.SlugField(max_length=64, unique=True)

    def __str__(self):
        return self.name

class Photo(models.Model):
    public_id = models.CharField(max_length=40, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="photos")
    orientation = models.ForeignKey(
        Orientation, on_delete=models.PROTECT, related_name="photos", null=True
    )
    image = models.ImageField(upload_to="photos/")
    image_webp = models.ImageField(
        upload_to="previews/webp/", null=True, blank=True
    )
    image_avif = models.ImageField(
        upload_to="previews/avif/", null=True, blank=True
    )
    blur_hash = models.CharField(max_length=64, blank=True)
    is_processed = models.BooleanField(default=False)
    
    # JSON поля для гибкости (теги и лицензии)
    tags = models.JSONField(default=list, blank=True)
    license_types = models.JSONField(default=list, blank=True)
    
    price = models.PositiveIntegerField(default=0)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="authored_photos",
    )
    
    # Метаданные
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    views = models.PositiveIntegerField(default=0)
    downloads = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "photo")
