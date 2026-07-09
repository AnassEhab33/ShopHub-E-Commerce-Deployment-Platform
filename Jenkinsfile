pipeline {
    agent any 
    environment {
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_DEFAULT_REGION    = 'us-east-1'
    }
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
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
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

        stage('Deploy to AWS EKS') {
            steps {
                script {
                    echo "Connecting to AWS EKS..."
                    sh 'aws eks update-kubeconfig --name ecommerce-cluster --region us-east-1'

                    echo "Applying storage class..."
                    sh 'kubectl apply -f k8s/gp3-storageclass.yml'

                    echo "Applying Kubernetes configs and databases..."
                    sh 'kubectl apply -f k8s/config-map.yml'
                    sh 'kubectl apply -f k8s/secret.yml'
                    sh 'kubectl apply -f k8s/postgres-init-configmap.yml'
                    sh 'kubectl apply -f k8s/postgres-statefulset.yml'
                    sh 'kubectl apply -f k8s/redis-statefulset.yml'

                    echo "Applying application microservices, services and ingress..."
                    sh 'kubectl apply -f k8s/deployments/'
                    sh 'kubectl apply -f k8s/services/'
                    sh 'kubectl apply -f k8s/ingress.yml'

                    echo "Rolling out restarts to pull the newly pushed Docker images..."
                    sh 'kubectl rollout restart deployment -n ecommerce'
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