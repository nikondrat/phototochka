from rest_framework import serializers
from .models import Post
from accounts.serializers import UserPublicSerializer

class PostListSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ("id", "title", "slug", "cover_image", "author", "created_at")

class PostDetailSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ("id", "title", "slug", "content", "cover_image", "author", "created_at", "updated_at")
