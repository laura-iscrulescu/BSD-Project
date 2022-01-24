user:
	docker-compose up --build -d user

authenticator:
	docker-compose up --build -d redis
	@sleep 5
	docker-compose up --build -d authenticator

services:
	docker-compose build redis authenticator user

run:
	$(MAKE) user
	$(MAKE) authenticator

stop:
	docker-compose down

.PHONY: user authenticator services run stop clean
