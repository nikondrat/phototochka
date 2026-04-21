from rest_framework import views, permissions, generics, status
from rest_framework.response import Response
from catalog.models import Photo, Category
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from .serializers import PhotoListSerializer, CategorySerializer # Need to create CategorySerializer

User = get_user_model()

class AdminStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        return Response({
            "totalPhotos": Photo.objects.count(),
            "totalAuthors": User.objects.filter(role=User.Role.AUTHOR).count(),
            "totalViews": Photo.objects.aggregate(s=Sum("views"))["s"] or 0,
            "totalSales": 0,
            "revenue": 0,
            "recentActivity": []
        })

class AdminPhotoListView(generics.ListAPIView):
    queryset = Photo.objects.all().select_related('author', 'category')
    serializer_class = PhotoListSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminAuthorListView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        authors = User.objects.filter(role=User.Role.AUTHOR).annotate(photo_count=Count('authored_photos'))
        data = [{
            "id": a.id,
            "username": a.username,
            "displayName": a.display_name,
            "email": a.email,
            "photoCount": a.photo_count,
            "isActive": a.is_active
        } for a in authors]
        return Response(data)

class AdminCategoryViewSet(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
