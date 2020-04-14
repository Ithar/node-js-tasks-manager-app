const chalk = require('chalk')
const mongoose = require('mongoose')
let connected = false

const dbService = {

    url() {
        return 'mongodb://127.0.0.1:27017/task-manager'
    },
    connect() {

        if (!connected) {

            console.log(chalk.blue('Connecting to DB'))

            mongoose.connect(this.url(), {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            })
        }

        connected = true;
    },
    findAll(model, res) {

        model.find({})
            .then((docs) => {
                console.log(chalk.blue('DB: Listing users ... '))
                res.send(docs)
            })
            .catch((err) => {
                console.log(chalk.red('DB: Failed to list users due to: ' + err))
                res.status(500).send({
                    error: 'Unbale to list users at present'
                })
            })

    }, 
    save(model, res) {

        model.save()
            .then((result) => {
                console.log(chalk.green('DB: Model saved'))
                res.status(201).send(result)
            }).catch((err) => {
                console.log(chalk.red('DB: Error failed to save model due to:\t' + err))

                if (err.errors !== undefined) {
                    return res.status(400).send({
                        error: err.errors
                    })
                }

                res.status(500).send({
                    error: 'Failed to save user'
                })

            })
    }
}


module.exports = dbService


