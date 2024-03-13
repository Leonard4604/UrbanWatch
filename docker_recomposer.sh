docker rm $(docker ps -a --filter "name=urbanwatch-frontend-1" --format "{{.ID}}")
docker rmi urbanwatch-frontend
docker compose up