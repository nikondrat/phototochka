from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        
        try:
            # Пытаемся найти пользователя по username или email
            user = User.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
        except User.DoesNotExist:
            # Пытаемся найти по email если username выглядит как email
            return None
        except User.MultipleObjectsReturned:
            return User.objects.filter(email__iexact=username).order_by('id').first()
        
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
