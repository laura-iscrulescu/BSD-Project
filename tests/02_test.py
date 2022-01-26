# User Service Tests

import requests
import json

def get_token():
    response = requests.post('http://localhost:8001/authenticator/password',json={'email' : 'test8', 'password' : 'test'})
    json_response = response.json()
    resp = json.loads(json_response['Resp'])
    # print(resp['token'])
    return resp

def get_token2():
    response = requests.post('http://localhost:8001/authenticator/password',json={'email' : 'test8', 'password' : 'test2'})
    json_response = response.json()
    resp = json.loads(json_response['Resp'])
    # print(resp['token'])
    return resp    

def single_logout(resp):
    response = requests.post('http://localhost:8001/authenticator/single',headers={'authorization' : 'Bearer ' + resp['token']})
    

def test_register():
    response = requests.post('http://localhost:8002/user/register',json={'email' : 'test8', 'password' : 'test', 'name' : 'test8'})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text


def test_get():
    resp = get_token()
    response = requests.post('http://localhost:8002/user/get',headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text
    single_logout(resp)


def test_changePasswd():
    resp = get_token()
    response = requests.post('http://localhost:8002/user/change/password',json={'oldPassword' : 'test','newPassword' : 'test2'}, headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text
    single_logout(resp)


def test_changeName():
    resp = get_token2()
    response = requests.post('http://localhost:8002/user/change/name',json={'name' : 'Test'},headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text
    single_logout(resp)

def test_changeGoal():
    resp = get_token2()
    response = requests.post('http://localhost:8002/user/change/goal',json={'goal' : 10},headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text
    single_logout(resp)


def test_delete():
    resp = get_token2()
    response = requests.post('http://localhost:8002/user/delete',json={'password' : 'test2'}, headers={'authorization' : 'Bearer ' + resp['token']})
    json_response = response.json()
    print(json_response)
    print(response.status_code)
    assert response.status_code == 200, response.text