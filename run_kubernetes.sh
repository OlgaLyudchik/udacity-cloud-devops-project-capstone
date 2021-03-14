#!/usr/bin/env bash

# Define path to DockerHub repo
dockerpath=olyudchik/weather-app
echo "Docker ID and Image: $dockerpath"

# Start local minikube cluster
minikube start

# Use minikube context
kubectl config use-context minikube

# Deploy to minikube cluster
kubectl apply -f deployment/secret.yml
kubectl apply -f deployment/config.yml
kubectl apply -f deployment/deployment.yml 
kubectl apply -f deployment/service.yml 

# Set docker image from Docker Hub
kubectl set image deployment weather-app weather-app=$dockerpath

# Wait for deployment to be ready
kubectl rollout status deployment weather-app

# List all pods, services and deployments running in minikube cluster
kubectl get all

# Check logs if application is running
kubectl logs service/weather-app

# Delete deployment and service
# kubectl delete -f deployment/deployment.yml
# kubectl delete -f deployment/service.yml