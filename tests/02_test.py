import requests
import json

def test_addTransaction():
    response = requests.post('http://localhost:3000/api/v1/transactions/add',data={'user_id': 'test',
        'value': '2000',
        'currency': 'EUR',
        'category': 'Others',
        'date': '2019-06-11T00:00'})
    # json_response = response.json()
    print(response.content)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_getTransaction():
    response = requests.post('http://localhost:3000/api/v1/transactions/',json={'user_id': 'test'})
    # json_response = response.json()
    print(response.content)
    print(response.status_code)
    assert response.status_code == 200, response.text