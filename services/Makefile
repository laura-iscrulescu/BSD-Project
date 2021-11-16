UNAME := $(shell uname -s)
ifeq ($(UNAME),Linux)
GO_GENERATOR = ./generator/bin/gojsonschema-linux
endif
ifeq ($(UNAME),Darwin)
GO_GENERATOR = ./generator/bin/gojsonschema-darwin
endif

user:
	docker-compose up --build -d user

authenticator:
	docker-compose up --build -d redis
	@sleep 5
	docker-compose --env-file config.env up --build -d authenticator

generate:
	$(GO_GENERATOR) \
		-p models \
		-o ./authenticator/mainDB/models/users.go \
		./generator/models/users.json
	$(GO_GENERATOR) \
		-p models \
		-o ./user/mainDB/models/users.go \
		./generator/models/users.json

services:
	docker-compose build redis authenticator user

run:
	$(MAKE) user
	$(MAKE) authenticator

stop:
	docker-compose down

clean:
	rm -rf authenticator/mainDB/models
	rm -rf user/mainDB/models

.PHONY: user authenticator generate services run stop clean
