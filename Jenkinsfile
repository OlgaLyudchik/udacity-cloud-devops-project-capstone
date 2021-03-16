def String image = ''
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
                script {
                    image = sh(script:'echo "olyudchik/weather-app:$(date +%Y.%m.%d-%H.%M)-$(git rev-parse --short HEAD)"', returnStdout: true).trim().toLowerCase()
                }
                echo "Docker image: ${image}"
                sh "docker tag weather-app:latest ${image}"
                sh 'docker image list'
            }
        }
        stage('Push Docker Image') {
            steps {
                echo 'Pushing docker image'
                withDockerRegistry([ url: '', credentialsId: 'dockerHubCredentials']) {
                    sh "docker push ${image}"
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
                    sh "kubectl set image deployment weather-app weather-app=${image}"
                    sh 'kubectl rollout status deployment weather-app'
                    sh 'kubectl get nodes'
                    sh 'kubectl get deployments'
                    sh 'kubectl get pod -o wide'
                    sh 'kubectl get services'
                    script {
                        hostname = sh(script:'kubectl get service weather-app -o jsonpath={.status.loadBalancer.ingress[0].hostname}', returnStdout: true)
                    }
                }            }
        }
        stage('Test') {
            steps {
                echo 'Testing if weather-app is running'
                sh "if curl -Is http://${hostname}:3000 | head -n 1 | grep '200 OK'; then echo 'Weather-app can be accessed here: http://${hostname}:3000'; else exit 1 ; fi"
            }
        }
        stage("Cleanup") {
            steps {
                echo 'Cleaning up'
                sh 'docker system prune -f'
            }
        }
    }
    post {
        success {
           script {
                def message=":female-judge: Weather-app verification is successful for ${image}"
                slackSend (channel: "weather-app-ci", color: '#88FF88', tokenCredentialId: 'slackCredentials', message: "${message}")
            }
        } 
        failure {
            script {
                def message=":female-judge: Weather-app verification failed for ${image}"
                slackSend (channel: "weather-app-ci", color: '#FF0000', tokenCredentialId: 'slackCredentials', message: "${message}")
            }
        }
    }
}