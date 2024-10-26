run:
	docker compose up -d

build:
	docker compose build

down:
	docker compose down

db-push:
	docker compose run --rm app npx prisma db push
	npx prisma generate

migrate:
	docker compose run --rm app npx prisma migrate deploy

studio:
	docker compose run --rm app npx prisma studio

check:
	docker compose run --rm app npm run check

lint:
	docker compose run --rm app npm run lint
