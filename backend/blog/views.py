from rest_framework import generics, permissions
from .models import Post
from .serializers import PostListSerializer, PostDetailSerializer

class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostListSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostDetailSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []
    lookup_field = "slug"
