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
            "trends": {
                "photos": "+12.4%",
                "authors": "+7.1%",
                "views": "+25.8%",
                "sales": "+14.2%"
            },
            "recentActivity": [
                {"type": "photo", "action": "Загружено новое фото", "author": "Nik Photo", "time": "2 часа назад"},
                {"type": "author", "action": "Зарегистрирован новый автор", "author": "Alice", "time": "5 часов назад"},
            ]
        })

class AuthorStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in [User.Role.AUTHOR, User.Role.ADMIN]:
            return Response({"detail": "Only authors can view stats"}, status=status.HTTP_403_FORBIDDEN)
            
        photos = Photo.objects.filter(author=request.user)
        total_views = photos.aggregate(s=Sum("views"))["s"] or 0
        total_downloads = photos.aggregate(s=Sum("downloads"))["s"] or 0
        
        # Группировка по дням для графика (последние 7 дней)
        from django.utils import timezone
        import datetime
        
        last_7_days = []
        for i in range(6, -1, -1):
            date = timezone.now().date() - datetime.timedelta(days=i)
            # В реальном проекте здесь были бы агрегаты по дням, 
            # сейчас вернем небольшую динамику на основе общей статы
            day_views = total_views // 10 + (i * 10)
            day_dls = total_downloads // 10 + i
            last_7_days.append({
                "date": date.isoformat(),
                "views": day_views,
                "downloads": day_dls,
                "earnings": day_dls * 100
            })
            
        top_photos_qs = photos.order_by("-views")[:5]
        top_photos = [{
            "id": p.public_id,
            "title": p.title,
            "views": p.views,
            "downloads": p.downloads,
            "earnings": p.downloads * 100 # TODO: real earnings from sales
        } for p in top_photos_qs]

        return Response({
            "totalPhotos": photos.count(),
            "totalViews": total_views,
            "totalDownloads": total_downloads,
            "totalEarnings": total_downloads * 100,
            "chartData": last_7_days,
            "topPhotos": top_photos,
            "trends": {
                "photos": "+3.5%",
                "views": "+18.2%",
                "downloads": "+4.1%",
                "earnings": "+9.7%"
            }
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
            "avatar": request.build_absolute_uri(a.avatar.url) if a.avatar else None,
            "photoCount": a.photo_count,
            "isActive": a.is_active
        } for a in authors]
        return Response(data)

class AdminCategoryViewSet(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
