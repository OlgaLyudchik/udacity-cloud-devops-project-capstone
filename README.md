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

## Local Deployment

The application for the project represents a web application built using JavaScript, Node.js and Express. It serves as a web service that shows you the current weather in the city, using the OpenWeather API. 

### Prerequisites

To test the deployment locally, make sure you have the following tools installed on your machine:

* `nodejs`
* `npm`
* `docker`
* `kubectl`
* `minikube`

Also, you would need a DockerHub account to upload the docker images. If you don't have it already, follow [these](https://docs.docker.com/docker-hub/) instructions to set it up.

Finally, configure the environment variables: the PORT, on which the application is going to run, and the API_KEY, which you can get from OpenWeather following [these](https://openweathermap.org/appid) instructions.


### Run application standalone

* Install required dependencies
    ``` bash
    cd weather-app
    npm install
    ```
* Start the webserver
    ``` bash
    npm start
    ```
* Access running application at http://localhost:{PORT}

### Run application in Docker

* Make sure, you have the `.env` file in the root folder, which contains PORT and API_KEY. 
* Run `./run_docker.sh` to build the docker image from Dockerfile and start the application in the container.
* Upload your docker image to DockerHub by running `./upload_docker.sh`. Substitute the *dockerpath* with the path to your DockerHub repository.

### Run application in Kubernetes with minikube

* Set up PORT and API_KEY environment variables in Kubernetes.

    Definition of environment variables in Kubernetes can be done in multiple ways. Server parameters such as PORT, can be configured using `ConfigMap`. Go to `deployment/config.yml` to set your PORT value. On the other hand, for sensitive information, such as passwords, keys and tokens, it is better to use `Secrets`, where the data is stored in encoded form using base64. Therefore, first, convert your API_KEY to base64 as follows `echo -n 'your-openweather-api-key' | base64`. Then, go to `deployment/secret.yml` to set this API_KEY encoded value.

* Make sure, you have uploaded your docker image to DockerHub by running `./upload_docker.sh` as described in the previous section.
* Run `./run_kubernetes.sh` to deploy the application to minikube cluster.

## Create Kubernetes Cluster in AWS

To create and manage the Kubernetes cluster, it's convenient to use [eksctl](https://eksctl.io/) CLI tool. It uses AWS CloudFormation to provision and configure resources for Amazon EKS clusters and node groups. Make sure, you installed kubectl and eksctl on your machine and configured [IAM permissions](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html) for your user to work with Amazon EKS. Then, run the following command
``` bash
./infrastructure/create_eks_cluster.sh
```

## Set Up Jenkins Server

Although you can install the Jenkins server on your local machine, it is recommended to do it on an EC2 instance to have the server running all the time. 

Here are the manual steps that you need to perform to set up a Jenkins server:
* Create EC2 instance with Ubuntu Server 18.04/20.04 LTS. Make sure that SSH port 22 and Jenkins port 8080 are open for access.
* On your EC2 instance, install Java 8/Java 11 and verify your installation.
    ``` bash
    sudo apt-get update
    sudo apt-get install openjdk-8-jdk
    java --version
    ```
* Install Jenkins and verify the installation (jenkins.service status should be Actice)
    ``` bash
    wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
    sudo sh -c 'echo deb https://pkg.jenkins.io/debian binary/ > \
        /etc/apt/sources.list.d/jenkins.list'
    sudo apt-get update
    sudo apt-get install jenkins
    sudo systemctl status jenkins
    ```
* Configure Jenkins with GUI. Head over to the URL http://your-ec2-instance-ip:8080 and fill in the administrator password, which you can get by running
     ``` bash
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    ```
    Then, simply follow the Jenkins pop-up configuration steps to install suggested plugins and create the first admin user.

* On Jenkins, install BlueOcean plugin following [these](https://www.jenkins.io/doc/book/blueocean/getting-started/) instructions.
* Set up a Pipeline project using Blue Ocean. Follow [these](https://www.jenkins.io/doc/book/blueocean/creating-pipelines/) instructions to create a new pipeline depending on where you store your code: standard Git repository, GitHub or Bitbucket.
* On your EC2 instance, install nodejs and npm to run the build and lint jobs and verify the installation.
    ``` bash
    sudo apt update
    sudo apt install nodejs npm
    node --version
    ```
* Install docker and verify your installation (docker.service status should be Active).
    ``` bash
    sudo apt update
    sudo apt upgrade
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
    sudo apt update
    sudo apt-cache policy docker-ce
    sudo apt install docker-ce
    sudo systemctl status docker
    ```
* Configure permissions for the Jenkins user to run docker.
    ``` bash
    sudo usermod -aG docker jenkins
    ```
* On Jenkins, install the [Docker Pipeline](https://plugins.jenkins.io/docker-workflow/) plugin.
* To allow Jenkins to push to your docker repository, create new credentials with your Docker Hub account details. On Jenkins, go to **Credentials → System → Global credentials → Add credentials**, chose the *Username with Password* kind and fill out the form with your username and password, id (e.g. *dockerHubCredentials*) and description. Refer to this id in your Jenkinsfile for authentication
    ``` bash
    withDockerRegistry([ url: '', credentialsId: 'dockerHubCredentials']) {
        sh "docker push ${image}"
    }
    ```
* On your EC2 instance, install AWS CLI version 2 and verify your installation.
    ```bash
    sudo apt install unzip
    sudo apt install glibc-source
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    aws --version
    ```
* On Jenkins, install the [Pipeline: AWS Steps](https://plugins.jenkins.io/pipeline-aws/) plugin.
* To allow Jenkins to run commands in AWS, create new credentials with your AWS details. On Jenkins, go to **Credentials → System → Global credentials → Add credentials**, chose the *AWS Credentials* kind and fill out the form with your aws access and secret keys, id (e.g. *awsCredentials*) and description. Refer to this id in your Jenkinsfile for authentication
    ``` bash
    withAWS(region: 'us-west-2', credentials: 'awsCredentials') {
        sh 'aws eks --region us-west-2 update-kubeconfig --name weather-app'
    }
    ```
* On your EC2 instance, install kubectl and verify your installation.
    ```bash
    curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
    chmod +x ./kubectl
    sudo mv ./kubectl /usr/local/bin
    which kubectl
    kubectl version
    ```
* Finally, restart Jenkins to apply all the changes.
    ``` bash
    sudo systemctl restart jenkins
    ```
