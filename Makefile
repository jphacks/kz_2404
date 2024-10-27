run:
	docker compose up -d

build:
	docker compose build

down:
	docker compose down

db-push:
	docker compose run --rm app npx prisma db push
	docker compose run --rm app npx prisma generate

db-seed:
	docker compose run --rm app npx prisma db seed

migrate:
	docker compose run --rm app npx prisma migrate deploy

# execじゃないとstudioに接続できない
studio:
	docker compose exec app npx prisma studio

check:
	docker compose run --rm app npm run check

lint:
	docker compose run --rm app npm run lint

prod-build:
	docker compose -f compose.prod.yml build
	docker compose -f compose.prod.yml run --rm app npm ci
	make prod-db
	docker compose -f compose.prod.yml run --rm app npm run build

prod-db:
	docker compose -f compose.prod.yml up db -d
	sleep 10
	docker compose -f compose.prod.yml run --rm app npx prisma generate
	docker compose -f compose.prod.yml run --rm app npx prisma migrate deploy

prod-run:
	docker compose -f compose.prod.yml up -d
