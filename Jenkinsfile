pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'malinda699'
        IMAGE_NAME      = 'nextjs-app'
        IMAGE_TAG       = "${BUILD_NUMBER}"
        
        PROD_SERVER_IP  = '3.222.216.236'
    }

    stages {
        stage('Fetch Source Code') {
            steps {
                echo 'Fetching code from GitHub...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                script {
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Image to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy to Next.js Server') {
            steps {
                echo 'Deploying to Next.js Production Server...'
            
                withCredentials([sshUserPrivateKey(credentialsId: 'nextjs-server-ssh', keyFileVariable: 'IDENTITY_KEY')]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no -i \${IDENTITY_KEY} ubuntu@${PROD_SERVER_IP} '
                        sudo docker pull ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
                        sudo docker stop nextjs-container || true
                        sudo docker rm nextjs-container || true
                        sudo docker run -d --name nextjs-container --restart always -p 3000:3000 ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful! Your Next.js App is LIVE!'
        }
        failure {
            echo 'Deployment Failed! Check the logs'
        }
    }
}