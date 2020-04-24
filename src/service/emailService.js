const chalk = require('chalk')
const sgMail = require('@sendgrid/mail')

let setupCompleted = false

const emailService = {

    init() {
        if (!setupCompleted) {
            sgMail.setApiKey(emailService.getAPIKey())
            setupCompleted = true
        }
    },
    getFromAddress() {
        return 'acmilano18@hotmail.com'
    },
    getAPIKey() {
        return process.env.SENDGIRD_API_KEY
    },
    sendWelcomeEmail(user) {

        try {
            const from = emailService.getFromAddress()
            const to = user.email
            const subject = 'Welcome to the Task Manager App' 
            const body = `Welcome ${user.username} to the app. I hope you enjoy your experience`
            
            sgMail.send({
                from,
                to,
                subject,
                text: body
            })

            console.info(chalk.blue('Registration email sent to: ' + to))

        } catch(e) {
            console.error(chalk.red('Failed to send email due to ' + e))
        }
        
    }
}

emailService.init()

module.exports = emailService
