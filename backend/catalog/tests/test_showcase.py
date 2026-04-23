import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from catalog.models import Category, Photo
from catalog import showcase_settings as sc

User = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_categories_list(client):
    Category.objects.create(name="Абстракция", slug="abstraction")
    res = client.get("/api/categories/")
    assert res.status_code == 200
    assert len(res.data) == 1
    assert res.data[0]["name"] == "Абстракция"
    assert res.data[0]["slug"] == "abstraction"


@pytest.mark.django_db
def test_showcase_shape(client):
    author = User.objects.create_user(
        username="a1", email="a1@b.com", password="secret12345"
    )
    cat = Category.objects.create(name="Природа", slug="nature")
    for i in range(3):
        Photo.objects.create(
            public_id=f"pid-{i}",
            title=f"Фото {i}",
            category=cat,
            author=author,
            orientation=Photo.Orientation.LANDSCAPE,
            price=100 + i,
            image=f"photos/x{i}.jpg",
            views=i * 10,
        )
    res = client.get("/api/showcase/")
    assert res.status_code == 200
    d = res.data
    for key in ("heroPhotos", "newPhotos", "categories", "authors", "benefits"):
        assert key in d
    assert len(d["benefits"]) == len(sc.SHOWCASE_BENEFITS)
    assert d["categories"][0]["slug"] == "nature"
    assert d["heroPhotos"] and d["newPhotos"]


@pytest.mark.django_db
def test_showcase_empty_photos(client):
    res = client.get("/api/showcase/")
    assert res.status_code == 200
    d = res.data
    assert d["heroPhotos"] == []
    assert d["newPhotos"] == []
    assert d["authors"] == []
