from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        BUYER = "buyer", "Покупатель"
        AUTHOR = "author", "Автор"
        ADMIN = "admin", "Администратор"

    role = models.CharField(
        max_length=10, 
        choices=Role.choices, 
        default=Role.BUYER
    )
    display_name = models.CharField(max_length=120, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    website = models.URLField(max_length=200, blank=True)
    instagram = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        if not self.display_name and self.first_name:
            self.display_name = self.first_name.strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.display_name or self.username
