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