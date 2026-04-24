from django.conf import settings
from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status, views
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from djangorestframework_camel_case.parser import CamelCaseJSONParser

from . import showcase_settings as showcase_sc
from .models import Category, Photo, Orientation
from .permissions import IsAuthenticatedUpload
from .serializers import (
    AuthorPhotoCreateSerializer,
    CategorySerializer,
    OrientationSerializer,
    PhotoDetailSerializer,
    PhotoListSerializer,
)
from .showcase_service import build_showcase_payload


class OrientationListView(generics.ListAPIView):
    queryset = Orientation.objects.all().order_by("name")
    serializer_class = OrientationSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    pagination_class = None


def _serialize_showcase_authors(authors, request):
    out = []
    for u in authors:
        name = (u.display_name or u.username or "").strip() or u.username
        role = getattr(u, "role", None) or "author"
        specialty = showcase_sc.ROLE_DISPLAY_SPECIALTY.get(
            str(role), showcase_sc.ROLE_DISPLAY_SPECIALTY["author"]
        )
        avatar_url = None
        if u.avatar and getattr(u.avatar, "name", ""):
            avatar_url = request.build_absolute_uri(u.avatar.url)
        out.append(
            {
                "id": str(u.id),
                "name": name,
                "username": u.username,
                "specialty": specialty,
                "avatarUrl": avatar_url,
                "photosCount": int(getattr(u, "photos_count", 0) or 0),
                "rating": showcase_sc.SHOWCASE_DEFAULT_AUTHOR_RATING,
            }
        )
    return out


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    pagination_class = None


class ShowcaseView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        ttl = getattr(settings, "SHOWCASE_CACHE_SECONDS", 0) or 0
        if ttl > 0:
            key = "api:showcase:v1"
            cached = cache.get(key)
            if cached is not None:
                return Response(cached)

        payload = build_showcase_payload()
        photo_ctx = {"request": request}
        data = {
            "heroPhotos": PhotoListSerializer(
                payload["heroPhotos"], many=True, context=photo_ctx
            ).data,
            "newPhotos": PhotoListSerializer(
                payload["newPhotos"], many=True, context=photo_ctx
            ).data,
            "categories": CategorySerializer(
                payload["categories"], many=True
            ).data,
            "orientations": OrientationSerializer(
                Orientation.objects.all(), many=True
            ).data,
            "authors": _serialize_showcase_authors(
                payload["authors"], request
            ),
            "benefits": payload["benefits"],
        }
        if ttl > 0:
            cache.set(key, data, timeout=ttl)
        return Response(data)


class AuthorPhotoListView(generics.ListCreateAPIView):
    """GET — список фото автора; POST — загрузка (multipart)."""

    permission_classes = [IsAuthenticatedUpload]
    parser_classes = (CamelCaseJSONParser, FormParser, MultiPartParser)
    pagination_class = None
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category__slug", "orientation"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AuthorPhotoCreateSerializer
        return PhotoListSerializer

    def get_queryset(self):
        return (
            Photo.objects.filter(author=self.request.user)
            .select_related("category", "author")
            .order_by("-uploaded_at")
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        out = PhotoListSerializer(
            serializer.instance,
            context=self.get_serializer_context(),
        )
        headers = self.get_success_headers(out.data)
        return Response(
            out.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        serializer.save()
        if getattr(settings, "SHOWCASE_CACHE_SECONDS", 0) > 0:
            cache.delete("api:showcase:v1")


class AuthorPhotoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET, PATCH, DELETE для конкретного фото автора."""

    permission_classes = [IsAuthenticatedUpload]
    serializer_class = AuthorPhotoCreateSerializer  # For updates
    lookup_field = "public_id"
    lookup_url_kwarg = "public_id"

    def get_queryset(self):
        return Photo.objects.filter(author=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PhotoListSerializer
        return AuthorPhotoCreateSerializer

    def perform_update(self, serializer):
        serializer.save()
        if getattr(settings, "SHOWCASE_CACHE_SECONDS", 0) > 0:
            cache.delete("api:showcase:v1")

    def perform_destroy(self, instance):
        instance.delete()
        if getattr(settings, "SHOWCASE_CACHE_SECONDS", 0) > 0:
            cache.delete("api:showcase:v1")


class PhotoListView(generics.ListAPIView):
    queryset = Photo.objects.select_related("category", "author").all()
    serializer_class = PhotoListSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category__slug", "orientation", "author__username"]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(tags__icontains=search)
        
        ids = self.request.query_params.get("ids")
        if ids:
            id_list = ids.split(",")
            qs = qs.filter(public_id__in=id_list)
            
        return qs

class PhotoDetailView(generics.RetrieveAPIView):
    queryset = Photo.objects.select_related("category", "author").all()
    serializer_class = PhotoDetailSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    lookup_field = "public_id"
    lookup_url_kwarg = "public_id"
