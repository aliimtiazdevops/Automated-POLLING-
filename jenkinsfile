pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel-token')
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/aliimtiazdevops/Automated-POLLING-'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Deploy to Vercel') {
            steps {
                bat "npx vercel --prod --token %VERCEL_TOKEN%"
            }
        }
    }
}
