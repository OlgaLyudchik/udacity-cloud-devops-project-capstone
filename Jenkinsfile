def String hostname = ''
pipeline {
    agent any
    environment {
        HOME = '.'
    }
    stages {
        stage('Build') {
            steps {
                dir('weather-app') {
                    echo 'Building weather-app'
                    sh 'npm --version'
                    sh 'node --version'
                    sh 'npm install'
                }                
            }
        }
        stage('Lint') {
            steps {
                dir('weather-app') {
                    echo 'Linting weather-app'
                    sh 'npm run lint'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building docker image'
                sh 'docker build -t weather-app .'
            }
        }
        stage('Push Docker Image') {
            steps {
                echo 'Pushing docker image'
                withDockerRegistry([ url: '', credentialsId: 'dockerHubCredentials']) {
                    sh 'docker tag weather-app:latest olyudchik/weather-app'
                    sh 'docker push olyudchik/weather-app'
                }
            }
        }
        stage('Create Config File'){
            steps {
                echo 'Creating kube config file'
                withAWS(region: 'us-west-2', credentials: 'awsCredentials') {
                    sh 'aws eks --region us-west-2 update-kubeconfig --name weather-app'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying to AWS EKS'
                withAWS(region: 'us-west-2', credentials: 'awsCredentials') {
                    sh 'kubectl config use-context arn:aws:eks:us-west-2:816520931486:cluster/weather-app'
                    sh 'kubectl apply -f deployment/config.yml'
                    sh 'kubectl apply -f deployment/secret.yml'
                    sh 'kubectl apply -f deployment/deployment.yml'
                    sh 'kubectl apply -f deployment/service.yml'
                    sh 'kubectl wait --for=condition=Ready --timeout=-1s pod -l app=weather-app'
                    sh 'kubectl get nodes'
                    sh 'kubectl get deployments'
                    sh 'kubectl get pod -o wide'
                    sh 'kubectl get services'
                    script {
                        hostname = sh(script:'kubectl get service weather-app -o jsonpath={.status.loadBalancer.ingress[0].hostname}', returnStdout: true)
                    }
                }
                echo "Access weather-app here: http://${hostname}:3000"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing if weather-app is running'
                sh "curl -Is http://${hostname}:3000 | head -n 1"
            }
        }
    }
}