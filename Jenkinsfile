node {
    def img
    
    stages {
        stage('Build') {
            steps {
                img = docker.build('obliviobvious/doxapp')
            }
        }
        stage('Publish') {
            steps {
                docker.withRegistry('', 'dockerhub-creds') {
                    img.push("1.${env.BUILD_ID}")
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'echo "Running ./bgdeploy.sh ansible rollout script"'
            }
        }
    }
}