redis:
	docker-compose up --build -d redis

authenticator:
	docker-compose up --build -d authenticator

user:
	docker-compose up --build -d user

transactions:
	docker-compose up --build -d transactions

nginx-backend:
	docker-compose up --build -d nginx-backend

nginx-frontend:
	docker-compose up --build -d nginx-frontend

services:
	docker-compose build redis authenticator user transactions nginx-frontend nginx-backend

run:
	$(MAKE) redis
	@sleep 10
	$(MAKE) authenticator
	$(MAKE) user
	$(MAKE) transactions
	$(MAKE) nginx-backend
	$(MAKE) nginx-frontend

stop:
	docker-compose down

.PHONY: redis authenticator user transactions nginx-backend nginx-frontend services run stop clean
