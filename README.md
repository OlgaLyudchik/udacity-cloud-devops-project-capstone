# Capstone

## Project Overview

The goal of the project is to showcase skills and knowledge developed throughout the Udacity Cloud DevOps Nanodegree program.
These include:
* Working in AWS
* Using Jenkins to implement Continuous Integration and Continuous Deployment
* Building pipelines
* Working with CloudFormation to deploy clusters
* Building Kubernetes clusters
* Building Docker containers in pipelines

---

## File Navigator

> ### Application:

- `weather-app/`: folder of the NodeJS application to be deployed to the Kubernetes

> ### CI/CD:

- `Dockerfile`: text file that contains set of instructions for docker to automatically build an image for the app to be run in a container
- `Jenkinsfile`: text file that contains the Jenkins Pipeline configurations
- `deployment/config.yml`: file that stores dictionary of configuration settings for the application
- `deployment/deployment.yml`: file with declarative updates to application that is deployed to kubernetes cluster
- `deployment/secret.yml`: file that stores and manages sensitive information for the application, such as tokens, keys and passwords
- `deployment/service.yml`: file that defines service to be deployed to kubernetes cluster

> ### Infrastructure:

- `infrastructure/create_eks_cluster.sh`: script file to create AWS EKS cluster with eksctl

> ### Screenshots:

- `screenshots/[S01]_failed_lint_job.png`: failed lint job due to missing semicolon in `server.js`
- `screenshots/[S02]_successful_lint_job.png`: successful lint job after applying `npm run lint:fix`
- `screenshots/[S03]_successful_docker_build_job.png`: successful build docker image job
- `screenshots/[S04]_successful_docker_push_job.png`: successful push docker image job
- `screenshots/[S05]_docker_image_in_dockerhub.png`: successfully pushed docker image in DockerHub
- `screenshots/[S06]_created_eks_cluster.png`: successfully created CloudFormation stack for EKS cluster
- `screenshots/[S07]_created_eks_managed_nodes.png`: successfully created CloudFormation stack for EKS Managed Nodes
- `screenshots/[S08]_running_eks_nodes_in_aws_console.png`: running EC2 instances of EKS nodes in AWS console
- `screenshots/[S09]_successful_deployment_rollout.png`: successfully rolled out deployment with new pods running and old terminating
- `screenshots/[S10]_running_application.png`: Chrome-tab with running application 

> ### Utils:

- `run_docker.sh`: script file to build an image from Dockerfile and run a docker container locally
- `run_kubernetes:sh`: script file to run on Kubernetes locally with minikube
- `upload_docker.sh`: script file to tag a local docker image and push it to docker hub


---