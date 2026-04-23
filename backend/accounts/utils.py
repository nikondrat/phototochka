import re

from django.contrib.auth import get_user_model

User = get_user_model()


def generate_unique_username_from_email(email: str) -> str:
    """
    Строит уникальный username по локальной части email, без '@' (политика ТЗ).
    При коллизиях — суффикс _1, _2, … в рамках лимита USERNAME_MAX_LEN.
    """
    from . import constants

    local = (email or "").split("@", 1)[0].lower()
    base = re.sub(r"[^a-z0-9_]", "", local.replace(".", "_").replace("-", "_"))
    if not base:
        base = "user"
    if len(base) > constants.USERNAME_MAX_LEN:
        base = base[: constants.USERNAME_MAX_LEN]
    candidate = base
    n = 0
    while User.objects.filter(username__iexact=candidate).exists():
        n += 1
        suffix = f"_{n}"
        head_len = max(1, constants.USERNAME_MAX_LEN - len(suffix))
        candidate = f"{base[:head_len]}{suffix}"
    return candidate
