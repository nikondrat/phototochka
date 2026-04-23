from django.contrib.auth import get_user_model
from django.db.models import Count

from .models import Category, Photo
from . import showcase_settings as sc

User = get_user_model()


def pick_hero_photos():
    """
    Популярные кадры с диверсификацией по категориям, затем добор по просмотрам.
    """
    pool = list(
        Photo.objects.select_related("category", "author")
        .order_by("-views", "-uploaded_at")[: sc.HERO_CANDIDATE_POOL]
    )
    if not pool:
        return []
    picked = []
    seen_categories = set()
    for p in pool:
        if len(picked) >= sc.SHOWCASE_HERO_LIMIT:
            break
        if p.category_id in seen_categories:
            continue
        picked.append(p)
        seen_categories.add(p.category_id)
    for p in pool:
        if len(picked) >= sc.SHOWCASE_HERO_LIMIT:
            break
        if p in picked:
            continue
        picked.append(p)
    return picked[: sc.SHOWCASE_HERO_LIMIT]


def pick_new_photos():
    return list(
        Photo.objects.select_related("category", "author")
        .order_by("-uploaded_at")[: sc.SHOWCASE_NEW_LIMIT]
    )


def list_categories_for_showcase():
    return list(
        Category.objects.all().order_by("name")[: sc.SHOWCASE_CATEGORY_LIMIT]
    )


def pick_featured_authors():
    return list(
        User.objects.annotate(photos_count=Count("authored_photos", distinct=True))
        .filter(photos_count__gt=0)
        .order_by("-photos_count", "id")[: sc.SHOWCASE_AUTHORS_LIMIT]
    )


def build_showcase_payload():
    return {
        "heroPhotos": pick_hero_photos(),
        "newPhotos": pick_new_photos(),
        "categories": list_categories_for_showcase(),
        "authors": pick_featured_authors(),
        "benefits": [dict(b) for b in sc.SHOWCASE_BENEFITS],
    }
