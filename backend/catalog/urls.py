from django.urls import path
from .views import PhotoListView, PhotoDetailView
from .admin_api import AdminStatsView, AdminPhotoListView, AdminAuthorListView, AdminCategoryViewSet

urlpatterns = [
    path("photos/", PhotoListView.as_view(), name="photo-list"),
    path("photos/<str:public_id>/", PhotoDetailView.as_view(), name="photo-detail"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/photos/", AdminPhotoListView.as_view(), name="admin-photos"),
    path("admin/authors/", AdminAuthorListView.as_view(), name="admin-authors"),
    path("admin/categories/", AdminCategoryViewSet.as_view(), name="admin-categories"),
]
