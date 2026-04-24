from django.urls import path
from .views import (
    AuthorPhotoListView,
    AuthorPhotoDetailView,
    CategoryListView,
    OrientationListView,
    PhotoListView,
    PhotoDetailView,
    ShowcaseView,
)
from .admin_api import AdminStatsView, AdminPhotoListView, AdminAuthorListView, AdminCategoryViewSet, AuthorStatsView

urlpatterns = [
    path("showcase/", ShowcaseView.as_view(), name="showcase"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("orientations/", OrientationListView.as_view(), name="orientation-list"),
    path("author/photos/", AuthorPhotoListView.as_view(), name="author-photos"),
    path("author/photos/<str:public_id>/", AuthorPhotoDetailView.as_view(), name="author-photo-detail"),
    path("author/stats/", AuthorStatsView.as_view(), name="author-stats"),
    path("photos/", PhotoListView.as_view(), name="photo-list"),
    path("photos/<str:public_id>/", PhotoDetailView.as_view(), name="photo-detail"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/photos/", AdminPhotoListView.as_view(), name="admin-photos"),
    path("admin/authors/", AdminAuthorListView.as_view(), name="admin-authors"),
    path("admin/categories/", AdminCategoryViewSet.as_view(), name="admin-categories"),
]
