import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_token_obtain_with_email(client):
    User.objects.create_user(
        username="u1", email="login@example.com", password="secret12345"
    )
    res = client.post(
        "/api/auth/token/",
        {"identifier": "login@example.com", "password": "secret12345"},
        format="json",
    )
    assert res.status_code == 200
    assert "access" in res.data
    assert "refresh" in res.data


@pytest.mark.django_db
def test_token_obtain_with_username(client):
    User.objects.create_user(
        username="photographer", email="p@example.com", password="secret12345"
    )
    res = client.post(
        "/api/auth/token/",
        {"identifier": "photographer", "password": "secret12345"},
        format="json",
    )
    assert res.status_code == 200
    assert "access" in res.data


@pytest.mark.django_db
def test_token_wrong_password(client):
    User.objects.create_user(
        username="u2", email="e2@example.com", password="secret12345"
    )
    res = client.post(
        "/api/auth/token/",
        {"identifier": "e2@example.com", "password": "wrong-password"},
        format="json",
    )
    assert res.status_code == 401


@pytest.mark.django_db
def test_register_returns_tokens_and_user(client):
    res = client.post(
        "/api/auth/register/",
        {
            "email": "newuser@example.com",
            "password": "secret12345",
            "displayName": "Новый автор",
        },
        format="json",
    )
    assert res.status_code == 201
    assert "access" in res.data
    assert "refresh" in res.data
    assert "user" in res.data
    assert res.data["user"]["email"] == "newuser@example.com"
    assert res.data["user"]["display_name"] == "Новый автор"
    assert User.objects.filter(email__iexact="newuser@example.com").exists()


@pytest.mark.django_db
def test_register_duplicate_email(client):
    User.objects.create_user(
        username="exists", email="dup@example.com", password="secret12345"
    )
    res = client.post(
        "/api/auth/register/",
        {
            "email": "dup@example.com",
            "password": "secret12345",
            "displayName": "X",
        },
        format="json",
    )
    assert res.status_code == 400
