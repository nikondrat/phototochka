from django.urls import path
from .views import PhotoListView, PhotoDetailView

urlpatterns = [
    path("photos/", PhotoListView.as_view(), name="photo-list"),
    path("photos/<str:public_id>/", PhotoDetailView.as_view(), name="photo-detail"),
]
