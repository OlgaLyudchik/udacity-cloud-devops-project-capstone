pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile'
        }
    }
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
    }
}