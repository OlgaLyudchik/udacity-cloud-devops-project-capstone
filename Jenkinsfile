pipeline {
    agent any
    environment {
        HOME = '.'
    }
    stages {
        stage('Build') {
            steps {
                dir('weather-app') {
                    echo "Building weather-app"
                    sh 'npm --version'
                    sh 'node --version'
                    sh 'npm install'
                }                
            }
        }
        stage('Lint') {
            steps {
                dir('weather-app') {
                    echo "Linting weather-app"
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
                    sh "docker tag weather-app:latest olyudchik/weather-app"
                    sh 'docker push olyudchik/weather-app'
                }
            }
        }
    }
}