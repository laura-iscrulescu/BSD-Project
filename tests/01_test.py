#Transactions Tests

import requests
import json

def test_addTransaction():
    response = requests.post('http://localhost:3000/api/v1/transactions/add',json={'user_id': 'test1',
        'name' : 'test2',
        'value': 2000,
        'category': 'Others',
        'date': '2019-06-11T00:00'})
    json_response = response.json()
    print(response.content)
    print(response.status_code)
    resp = json.loads(json_response['Resp'])
    print(resp)
    assert response.status_code == 200, response.text


def test_getTransaction():
    response = requests.post('http://localhost:3000/api/v1/transactions/',json={'user_id': 'test'})
    json_response = response.json()
    print(response.content)
    print(response.status_code)

    assert response.status_code == 200, response.text


def test_changeDate():
    response = requests.post('http://localhost:3000/api/v1/transactions/date',json={'user_id': 'test', 'old_date': '2019-06-11T00:00', 'new_date' : '2020-06-11T00:00'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)

    assert response.status_code == 200, response.text

# def test_deleteTransaction():
#     # resp = test_addTransaction()
#     response = requests.post('http://localhost:3000/api/v1/transactions/delete',json={'_id' : '61f1bf2b32cdf9000946b10a'})
#     # json_response = response.json()
#     print(response.content)
#     print(response.status_code)
#     assert response.status_code == 200, response.text