pipeline {
  
    environment {
        registry = "obliviobvious/doxapp"
        dhcreds = 'dockerhub-creds'
        img = ''
    }
  
    stages {
        
        stage('Build') {
            steps{
                script {
                    img = docker.build registry // + ":${BUILD_ID}"
                }
            }
        }

        stage('Publish') {
            steps{
                script {
                    docker.withRegistry('', dhcreds) {
                        img.push()
                    }
                }
            }
        }
    }
}