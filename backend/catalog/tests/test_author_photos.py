from io import BytesIO

import pytest
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient

from catalog.models import Category, Photo

User = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_author_photos_requires_auth(client):
    res = client.get("/api/author/photos/")
    assert res.status_code == 401


@pytest.mark.django_db
def test_author_photos_returns_only_own(client):
    u1 = User.objects.create_user(username="a1", email="a1@b.com", password="secret12345")
    u2 = User.objects.create_user(username="a2", email="a2@b.com", password="secret12345")
    cat = Category.objects.create(name="N", slug="n")
    Photo.objects.create(
        public_id="mine",
        title="Mine",
        category=cat,
        author=u1,
        orientation=Photo.Orientation.LANDSCAPE,
        image="photos/mine.jpg",
    )
    Photo.objects.create(
        public_id="theirs",
        title="Theirs",
        category=cat,
        author=u2,
        orientation=Photo.Orientation.LANDSCAPE,
        image="photos/theirs.jpg",
    )
    client.force_authenticate(user=u1)
    res = client.get("/api/author/photos/")
    assert res.status_code == 200
    assert isinstance(res.data, list)
    assert len(res.data) == 1
    assert res.data[0]["publicId"] == "mine"


def _tiny_jpeg_bytes() -> bytes:
    buf = BytesIO()
    Image.new("RGB", (4, 4), color=(10, 120, 80)).save(buf, format="JPEG")
    return buf.getvalue()


@pytest.mark.django_db(transaction=True)
def test_author_photo_create_multipart(client):
    u1 = User.objects.create_user(
        username="up1", email="up1@b.com", password="secret12345"
    )
    cat = Category.objects.create(name="Up", slug="up-slug")
    img = SimpleUploadedFile("a.jpg", _tiny_jpeg_bytes(), content_type="image/jpeg")
    client.force_authenticate(user=u1)
    res = client.post(
        "/api/author/photos/",
        {
            "title": "New shot",
            "image": img,
            "category_slug": "up-slug",
            "description": "Desc",
            "price": 10,
            "tags": "a,b",
        },
        format="multipart",
    )
    assert res.status_code == 201, res.data
    assert res.data["title"] == "New shot"
    p = Photo.objects.get(public_id=res.data["publicId"])
    assert p.author_id == u1.id
    assert p.is_processed is True
    assert p.image_webp
