# MongoDB Credentials

In order to pass MongoDB credentials to the containers, you have to create a
file with the name "config.env" and with the next contents:
```
MONGO_USER=<mongo_user>
MONGO_PASSWORD=<mongo_password>
```

Also, you need to specify this file in the "docker-compose.yml" file for your
specific service:
```
...
env_file:
    - config.env
...
```