# Authenticator Service Tests

import requests
import json

resp = {}

def test_LoginWithPassword():
    response = requests.post('http://localhost:8001/authenticator/password',json={'email' : 'laura', 'password' : 'laura'})
    json_response = response.json()
    print(json_response)
    resp = json.loads(json_response['Resp'])
    print(resp)
    print(resp['token'])
    print(response.status_code)
    assert response.status_code == 200, response.text
    return resp


def test_CheckToken():
    resp = test_LoginWithPassword()
    response = requests.post('http://localhost:8001/authenticator/token',headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_LogoutSingleDevice():
    resp = test_LoginWithPassword()
    response = requests.post('http://localhost:8001/authenticator/single',headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text

def test_LogoutAllDevices():
    resp = test_LoginWithPassword()
    response = requests.post('http://localhost:8001/authenticator/all',headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text