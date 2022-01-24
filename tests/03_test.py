# User Service Tests

import requests
import json

def test_register():
    response = requests.post('http://localhost:8002/register',json={'email' : 'test', 'password' : 'test', 'name' : 'test'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_get():
    response = requests.post('http://localhost:8002/get',json={'email' : 'test'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_changePasswd():
    response = requests.post('http://localhost:8002/change/password',json={'email' : 'test', 'oldPassword' : 'test', 'newPassword' : 'newtest'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_changeName():
    response = requests.post('http://localhost:8002/change/name',json={'email' : 'test', 'name' : 'Test'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text

def test_changeGoal():
    response = requests.post('http://localhost:8002/change/goal',json={'email' : 'test'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_delete():
    response = requests.post('http://localhost:8002/delete',json={'email' : 'test'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text

def test_addCategory():
    response = requests.post('http://localhost:8002/category/add',json={'email' : 'test', 'category' : 'new-category'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_removeCategory():
    response = requests.post('http://localhost:8002/category/remove',json={'email' : 'test', 'category' : 'new-category'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text