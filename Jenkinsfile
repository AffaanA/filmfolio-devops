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
                    set -e
                    echo "Installing backend dependencies..."
                    npm install --legacy-peer-deps
                '''
            }
        }

        stage('Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh '''
                        set -e
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
                        set -e
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
                withCredentials([
                    string(
                        credentialsId: 'filmfolio-jwt-secret',
                        variable: 'JWT_SECRET'
                    )
                ]) {
                    sshagent([env.SSH_CREDENTIALS]) {
                        sh '''
                            set -e
                            set +x

                            printf '%s\\n' "$JWT_SECRET" |
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_1} 'bash -c '"'"'
                                set -e

                                IFS= read -r JWT_SECRET

                                if [ ! -d /opt/filmfolio/.git ]; then
                                    echo "First deployment: cloning repository..."
                                    sudo rm -rf /opt/filmfolio
                                    sudo git clone https://github.com/AffaanA/filmfolio-devops.git /opt/filmfolio
                                    sudo chown -R ubuntu:ubuntu /opt/filmfolio
                                else
                                    echo "Updating repository..."
                                    cd /opt/filmfolio
                                    git fetch origin main
                                    git reset --hard origin/main
                                fi

                                cd /opt/filmfolio

                                umask 077
                                printf "JWT_SECRET=%s\\n" "$JWT_SECRET" > .env
                                unset JWT_SECRET

                                echo "Checking and enabling swap..."

                                if [ ! -f /swapfile ]; then
                                    sudo fallocate -l 2G /swapfile
                                    sudo chmod 600 /swapfile
                                    sudo mkswap /swapfile
                                fi

                                if ! sudo swapon --show | grep -q "/swapfile"; then
                                    sudo swapon /swapfile
                                fi

                                free -h

                                echo "Building Docker images..."
                                docker compose build

                                echo "Starting application..."
                                docker compose up -d

                                docker compose ps
                            '"'"''
                        '''
                    }
                }
            }
        }

        stage('Deploy EC2 #2') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'filmfolio-jwt-secret',
                        variable: 'JWT_SECRET'
                    )
                ]) {
                    sshagent([env.SSH_CREDENTIALS]) {
                        sh '''
                            set -e
                            set +x

                            printf '%s\\n' "$JWT_SECRET" |
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_2} 'bash -c '"'"'
                                set -e

                                IFS= read -r JWT_SECRET

                                if [ ! -d /opt/filmfolio/.git ]; then
                                    echo "First deployment: cloning repository..."
                                    sudo rm -rf /opt/filmfolio
                                    sudo git clone https://github.com/AffaanA/filmfolio-devops.git /opt/filmfolio
                                    sudo chown -R ubuntu:ubuntu /opt/filmfolio
                                else
                                    echo "Updating repository..."
                                    cd /opt/filmfolio
                                    sudo chown -R ubuntu:ubuntu /opt/filmfolio
                                    git fetch origin main
                                    git reset --hard origin/main
                                fi

                                cd /opt/filmfolio

                                umask 077
                                printf "JWT_SECRET=%s\\n" "$JWT_SECRET" > .env
                                unset JWT_SECRET

                                echo "Checking and enabling swap..."

                                if [ ! -f /swapfile ]; then
                                    sudo fallocate -l 2G /swapfile
                                    sudo chmod 600 /swapfile
                                    sudo mkswap /swapfile
                                fi

                                if ! sudo swapon --show | grep -q "/swapfile"; then
                                    sudo swapon /swapfile
                                fi

                                free -h

                                echo "Building Docker images..."
                                docker compose build

                                echo "Starting application..."
                                docker compose up -d

                                docker compose ps
                            '"'"''
                        '''
                    }
                }
            }
        }

        stage('Deployment Verification') {
            steps {
                sshagent([env.SSH_CREDENTIALS]) {
                    sh '''
                        set -e

                        verify_instance() {
                            host="$1"
                            echo "=== Verifying ${host} ==="

                            ssh -o StrictHostKeyChecking=no "ubuntu@${host}" 'bash -s' <<'REMOTE'
set -e

check_http() {
    name="$1"
    url="$2"
    attempt=1

    while [ "$attempt" -le 12 ]; do
        status=$(curl -sS -o /dev/null -w "%{http_code}" \
            --max-time 5 "$url" || true)

        if [ "$status" = "200" ]; then
            echo "PASS: $name returned HTTP 200"
            return 0
        fi

        echo "Attempt $attempt: $name returned HTTP ${status:-no response}"
        attempt=$((attempt + 1))
        sleep 5
    done

    echo "FAIL: $name did not return HTTP 200"
    exit 1
}

check_http "Frontend" "http://127.0.0.1:3000/"
check_http "Backend health and database" "http://127.0.0.1:5000/health"
REMOTE
                        }

                        verify_instance "$EC2_1"
                        verify_instance "$EC2_2"

                        echo "=== Verifying ALB target health ==="

                        TARGET_GROUPS="
arn:aws:elasticloadbalancing:us-east-1:357542025325:targetgroup/filmfolio-frontend-tg/6773d7421a44a3d4
arn:aws:elasticloadbalancing:us-east-1:357542025325:targetgroup/filmfolio-backend-tg/b7f54c8a2f689df5
"

                        for tg in $TARGET_GROUPS; do
                            echo "Checking $tg"
                            attempt=1

                            while [ "$attempt" -le 12 ]; do
                                total=$(aws elbv2 describe-target-health \
                                    --region us-east-1 \
                                    --target-group-arn "$tg" \
                                    --query 'length(TargetHealthDescriptions)' \
                                    --output text \
                                    --no-cli-pager)

                                healthy=$(aws elbv2 describe-target-health \
                                    --region us-east-1 \
                                    --target-group-arn "$tg" \
                                    --query 'length(TargetHealthDescriptions[?TargetHealth.State==`healthy`])' \
                                    --output text \
                                    --no-cli-pager)

                                if [ "$total" = "2" ] && [ "$healthy" = "2" ]; then
                                    echo "PASS: Both targets are healthy"
                                    break
                                fi

                                echo "Attempt $attempt: healthy=$healthy, total=$total"
                                attempt=$((attempt + 1))
                                sleep 10
                            done

                            if [ "$total" != "2" ] || [ "$healthy" != "2" ]; then
                                echo "FAIL: Targets are not all healthy: $tg"
                                exit 1
                            fi
                        done

                        echo "All application and ALB health checks passed."
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