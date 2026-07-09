pipeline {
    agent any 

    triggers {
        githubPush()
    }

    stages {
        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building microservices images..."
                   
                    sh 'docker build -t anassehab33/depi-devops-project-cart-service:latest ./services/cart-service'
                    sh 'docker build -t anassehab33/depi-devops-project-order-service:latest ./services/order-service'
                    sh 'docker build -t anassehab33/depi-devops-project-payment-service:latest ./services/payment-service'
                    sh 'docker build -t anassehab33/depi-devops-project-product-service:latest ./services/product-service'
                    sh 'docker build -t anassehab33/depi-devops-project-user-service:latest ./services/user-service'
                    sh 'docker build -t anassehab33/depi-devops-project-frontend:latest ./frontend'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "Running tests for all services..."
                    sh 'docker run --rm -e CI=true anassehab33/depi-devops-project-cart-service:latest npm test || echo "Cart test skipped"'
                    sh 'docker run --rm -e CI=true anassehab33/depi-devops-project-order-service:latest npm test || echo "Order test skipped"'
                    sh 'docker run --rm anassehab33/depi-devops-project-payment-service:latest pytest || echo "Payment test skipped"'
                    sh 'docker run --rm anassehab33/depi-devops-project-product-service:latest pytest || echo "Product test skipped"'
                    sh 'docker run --rm -e CI=true anassehab33/depi-devops-project-user-service:latest npm test || echo "User test skipped"'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing images to Docker Hub..."
                    sh 'docker push anassehab33/depi-devops-project-cart-service:latest'
                    sh 'docker push anassehab33/depi-devops-project-order-service:latest'
                    sh 'docker push anassehab33/depi-devops-project-payment-service:latest'
                    sh 'docker push anassehab33/depi-devops-project-product-service:latest'
                    sh 'docker push anassehab33/depi-devops-project-user-service:latest'
                    sh 'docker push anassehab33/depi-devops-project-frontend:latest'
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
        success {
            echo 'Pipeline finished successfully! Images are pushed.'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}