import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from catalog.models import Category, Photo

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def sample_data(db):
    author = User.objects.create_user(username="testauthor", password="password123")
    category = Category.objects.create(name="Nature", slug="nature")
    photo = Photo.objects.create(
        public_id="test-photo",
        title="Test Photo",
        category=category,
        author=author,
        orientation=Photo.Orientation.LANDSCAPE,
        price=100,
        image="photos/test.jpg"
    )
    return author, category, photo

@pytest.mark.django_db
def test_photo_list(api_client, sample_data):
    response = api_client.get("/api/photos/")
    assert response.status_code == 200
    assert "results" in response.data
    assert len(response.data["results"]) == 1
    assert response.data["results"][0]["title"] == "Test Photo"
    # Проверка camelCase
    assert "publicId" in response.data["results"][0]

@pytest.mark.django_db
def test_photo_detail(api_client, sample_data):
    _, _, photo = sample_data
    response = api_client.get(f"/api/photos/{photo.public_id}/")
    assert response.status_code == 200
    assert response.data["publicId"] == "test-photo"

@pytest.mark.django_db
def test_photo_filter(api_client, sample_data):
    response = api_client.get("/api/photos/?category__slug=nature")
    assert response.status_code == 200
    assert len(response.data["results"]) == 1

    response = api_client.get("/api/photos/?category__slug=empty")
    assert response.status_code == 200
    assert len(response.data["results"]) == 0
