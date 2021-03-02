#!/usr/bin/env bash

# Define path to DockerHub repo
dockerpath=olyudchik/weather-app
echo "Docker ID and Image: $dockerpath"

# Authenticate with DockerHub
docker login

# Tag the image
docker tag weather-app:latest $dockerpath

# Push the image
docker push $dockerpath