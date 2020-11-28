pipeline {
    agent { dockerfile true }

    def img

    stages {
        stage('Build') {
            img = docker.build('obliviobvious/doxapp')
        }
        stage('Publish') {
            docker.withRegistry('', 'dockerhub-creds') {
                img.push("1.${env.BUILD_ID}")
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo "Running ./bgdeploy.sh ansible rollout script"'
            }
        }
    }
}