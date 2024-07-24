docker compose down
docker rmi urbanwatch-frontend urbanwatch-auth urbanwatch-report urbanwatch-notification # postgres:14 dpage/pgadmin4
# docker volume rm urbanwatch_pgadmin urbanwatch_pgdata
docker compose up -d