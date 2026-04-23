from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import IdentifierTokenObtainPairView, RegisterView, UserMeView

urlpatterns = [
    path("token/", IdentifierTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("me/", UserMeView.as_view(), name="user_me"),
]
