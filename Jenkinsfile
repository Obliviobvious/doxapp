pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                sh 'echo building...'
            }
        }
        stage('Publish') {
            steps {
                sh 'echo "docker login"'
                sh 'echo "publishing (pushing to dockerhub)..."'
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo "Running ./bgdeploy.sh ansible rollout script"'
            }
        }
    }
}