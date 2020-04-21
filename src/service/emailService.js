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
        return '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'
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

            console.log(chalk.blue('Registration email sent to: ' + to))

        } catch(e) {
            console.log(chalk.red('Failed to send email due to ' + e))
        }
        
    }
}

emailService.init()

module.exports = emailService
