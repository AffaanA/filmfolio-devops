pipeline {
    agent any

    environment {
        SSH_CREDENTIALS = 'filmfolio-ssh'
        EC2_1 = '10.0.0.174'
        EC2_2 = '10.0.11.66'
        APP_DIR = '/opt/filmfolio'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Dependencies') {
            steps {
                sh '''
                    echo "Installing backend dependencies..."
                    npm install --legacy-peer-deps
                '''
            }
        }

        stage('Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Installing frontend dependencies..."
                        npm install --legacy-peer-deps
                        npm install eslint@8 --save-dev --legacy-peer-deps
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Building frontend..."
                        CI=false NODE_OPTIONS=--max-old-space-size=768 npm run build
                    '''
                }
            }
        }

        stage('Install Docker Compose') {
            steps {
                sshagent([env.SSH_CREDENTIALS]) {
                    sh '''
                        set -e

                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_1} "
                            set -e
                            sudo apt-get update
                            sudo apt-get install -y docker-compose-v2
                            docker compose version
                        "

                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_2} "
                            set -e
                            sudo apt-get update
                            sudo apt-get install -y docker-compose-v2
                            docker compose version
                        "
                    '''
                }
            }
        }

        stage('Deploy EC2 #1') {
            steps {
                sshagent([env.SSH_CREDENTIALS]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_1} "
                            set -e

                            if [ ! -d /opt/filmfolio/.git ]; then
                                echo 'First deployment: cloning repository...'
                                sudo rm -rf /opt/filmfolio
                                sudo git clone https://github.com/AffaanA/filmfolio-devops.git /opt/filmfolio
                                sudo chown -R ubuntu:ubuntu /opt/filmfolio
                            else
                                echo 'Existing deployment: pulling latest changes...'
                                cd /opt/filmfolio
                                git fetch origin main
                                git reset --hard origin/main
                            fi

                            cd /opt/filmfolio

                            echo 'Checking and enabling swap...'

                            if [ ! -f /swapfile ]; then
                                sudo fallocate -l 2G /swapfile
                                sudo chmod 600 /swapfile
                                sudo mkswap /swapfile
                            fi

                            if ! sudo swapon --show | grep -q '/swapfile'; then
                                sudo swapon /swapfile
                            fi

                            free -h

                            echo 'Building Docker images...'
                            docker compose build

                            echo 'Starting application containers...'
                            docker compose up -d

                            echo 'Checking container status...'
                            docker compose ps
                        "
                    '''
                }
            }
        }

        stage('Deploy EC2 #2') {
            steps {
                sshagent([env.SSH_CREDENTIALS]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_2} "
                            set -e

                            if [ ! -d /opt/filmfolio/.git ]; then
                                echo 'First deployment: cloning repository...'
                                sudo rm -rf /opt/filmfolio
                                sudo git clone https://github.com/AffaanA/filmfolio-devops.git /opt/filmfolio
                                sudo chown -R ubuntu:ubuntu /opt/filmfolio
                            else
                                echo 'Existing deployment: pulling latest changes...'
                                cd /opt/filmfolio
                                sudo chown -R ubuntu:ubuntu /opt/filmfolio
                                git fetch origin main
                                git reset --hard origin/main
                            fi

                            cd /opt/filmfolio

                            echo 'Checking and enabling swap...'

                            if [ ! -f /swapfile ]; then
                                sudo fallocate -l 2G /swapfile
                                sudo chmod 600 /swapfile
                                sudo mkswap /swapfile
                            fi

                            if ! sudo swapon --show | grep -q '/swapfile'; then
                                sudo swapon /swapfile
                            fi

                            free -h

                            echo 'Building Docker images...'
                            docker compose build

                            echo 'Starting application containers...'
                            docker compose up -d

                            echo 'Checking container status...'
                            docker compose ps
                        "
                    '''
                }
            }
        }

        stage('Deployment Verification') {
            steps {
                sshagent([env.SSH_CREDENTIALS]) {
                    sh '''
                        set -e

                        echo "Checking EC2 #1..."
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_1} \
                            "docker compose -f ${APP_DIR}/docker-compose.yml ps"

                        echo "Checking EC2 #2..."
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_2} \
                            "docker compose -f ${APP_DIR}/docker-compose.yml ps"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Filmfolio deployment completed successfully.'
        }

        failure {
            echo 'Filmfolio deployment failed.'
        }
    }
}
