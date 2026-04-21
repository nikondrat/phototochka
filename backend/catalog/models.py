from django.conf import settings
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Photo(models.Model):
    class Orientation(models.TextChoices):
        LANDSCAPE = "landscape", "Landscape"
        PORTRAIT = "portrait", "Portrait"
        SQUARE = "square", "Square"

    public_id = models.CharField(max_length=40, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="photos")
    image = models.ImageField(upload_to="photos/")
    orientation = models.CharField(max_length=16, choices=Orientation.choices)
    
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
