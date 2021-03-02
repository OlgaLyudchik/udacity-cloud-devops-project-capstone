#!/usr/bin/env bash

# Build image and add a descriptive tag
docker build -t weather-app .

# List docker images
docker image ls | grep weather-app

# Start a docker container to run the app
docker run --name weather-app --env-file .env -p 8080:3000 -d weather-app

# Check docker logs if the app has been started
docker logs -f weather-app 