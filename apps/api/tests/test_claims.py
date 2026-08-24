import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_list_claims():
    response = client.get("/claims/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_claim_not_found():
    response = client.get("/claims/NONEXISTENT")
    assert response.status_code == 404

def test_analyze_empty_text():
    response = client.post("/extension/analyze", json={"text": ""})
    assert response.status_code == 200
    assert response.json()["matched"] == False

def test_analyze_threshold_validation():
    response = client.post("/extension/analyze", json={"text": "test", "threshold": 2.0})
    assert response.status_code == 422  # Validation error
