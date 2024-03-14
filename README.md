# How to use the docker recompose to update image and container
```
sh docker_recomposer.sh
```
This will find the container for the frontend and remove it. Then it will remove the image.
After that it will use the `docker compose up` command to re build the docker and run it.

Remind that you have to modify the script for every microservice that you implemented.