from rest_framework import permissions


class IsAuthenticatedUpload(permissions.BasePermission):
    """Загрузка фото — только аутентифицированные пользователи."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
