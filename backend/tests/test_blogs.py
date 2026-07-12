from fastapi.testclient import TestClient
from main import app
import pytest

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_home(client):
    data = client.get("/")
    assert data.status_code == 200
    assert data.json() == {"status": "working"}

def test_get_blogs(client):
    data = client.get("/blogs/")
    assert data.status_code == 200

def test_register(client):
    data = client.post("/user/register", json={"email": "testuser@test.com", "password": "12345678"})
    assert data.status_code == 201

def test_login(client):
    data = client.post("/user/login", json={"email": "testuser@test.com", "password": "12345678"})
    assert data.status_code == 200
    assert "access_token" in data.json()

def test_create_blog(client):
    login = client.post("/user/login", json={"email": "testuser@test.com", "password": "12345678"})
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    data= client.post("blogs/",json={"title":"test blog123123","content":"testing this blog"},headers=headers)
    assert data.status_code == 201

def test_delete_blog_unauthorized(client):
    data = client.delete("blogs/123")
    assert data.status_code == 401