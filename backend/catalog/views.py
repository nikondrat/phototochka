from rest_framework import generics, permissions
from .models import Photo
from .serializers import PhotoListSerializer, PhotoDetailSerializer
from django_filters.rest_framework import DjangoFilterBackend

class PhotoListView(generics.ListAPIView):
    queryset = Photo.objects.select_related("category", "author").all()
    serializer_class = PhotoListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category__slug", "orientation"]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(tags__icontains=search)
        return qs

class PhotoDetailView(generics.RetrieveAPIView):
    queryset = Photo.objects.select_related("category", "author").all()
    serializer_class = PhotoDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "public_id"
    lookup_url_kwarg = "public_id"
