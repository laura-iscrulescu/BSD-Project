import requests

def test_route():
     response = requests.get("http://localhost:3000/api/v1/")
     assert response.status_code == 200, response.text
