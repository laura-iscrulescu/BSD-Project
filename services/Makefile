user:
	docker-compose up --build -d user

authenticator:
	docker-compose up --build -d redis
	@sleep 10
	docker-compose up --build -d authenticator

nginx:
	docker-compose up --build -d web

services:
	docker-compose build redis authenticator user nginx

run:
	$(MAKE) user
	$(MAKE) authenticator
	$(MAKE) nginx

stop:
	docker-compose down

.PHONY: user authenticator nginx services run stop clean
