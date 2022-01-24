import requests

def test_route():
     response = requests.get("http://localhost:3000/api/v1/")
     assert response.status_code == 200, response.text


# def test_get_transactions():
#      response = requests.get("localhost:3000/api/v1/transactions")
#      assert response.status_code == 200



# def test_get_transactions_date():
#      response = requests.get("localhost:3000/api/v1/transactions/date")
#      assert response.status_code == 200

