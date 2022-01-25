# BSD-Project

Create .env file and add the following parameters
```
MONGO_USER= <user>
MONGO_PASSWORD= <password>
MONGO_URI= <uri>
```

Then run the following commands
```
npm i
npm run dev
```

```
localhost:3000/api/v1/transactions/add 
{
    "user_id": "test",
    "value": 2000,
    "currency": "EUR",
    "category": "Others",
    "date": "2019-06-11T00:00"
}

localhost:3000/api/v1/transactions/delete
{
    "transactionId": "61bd9b30502aeb3af776f8bf"
}

localhost:3000/api/v1/transactions/
{
    "user_id":"test"
}

localhost:3000/api/v1/transactions/date
{
    "user_id": "test",
    "old_date": "2019-06-11T00:00",
    "new_date": "2020-07-09T23:59"
}
```
# Bugdet Planner - BSD Project

# Mock-ups
The mock-ups for this project can be viewed [here](https://www.figma.com/file/bnrLkyiflEd4Ufb2uaukU4/BSD?node-id=2%3A14).
This project is going to use the following [color scheme](https://coolors.co/ff6d00-ff7900-ff8500-ff9100-ff9e00-240046-3c096c-5a189a-7b2cbf-9d4edd).

# Architecture diagram
![image](https://user-images.githubusercontent.com/43547317/144043825-934d5342-f714-459b-bfed-921b3672bf7a.png)

# Technologies
The following technologies are going to be used in order to implement this project:
- Angular
- NodeJS
- GO
- Python
- NGINX
- MongoDB
- RedisDB


# Members:
- Dumitru Călin 
- Iscrulescu Laura
- Marinescu Ana
- Moraru Liviu
- Radu Cosmin
