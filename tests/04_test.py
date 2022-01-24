# Authenticator Service Tests

import requests
import json


def test_LoginWithPassword():
    response = requests.post('http://localhost:8001/password',json={'email' : 'laura', 'password' : 'laura'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_CheckToken():
    response = requests.post('http://localhost:8001/token',json={'token' : '2dd89961-be84-4805-9715-4ed97c950e92'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_LogoutSingleDevice():
    response = requests.post('http://localhost:8001/single',json={'token' : '2dd89961-be84-4805-9715-4ed97c950e92'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text

def test_LogoutAllDevices():
    response = requests.post('http://localhost:8001/all',json={'email' : 'laura'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text