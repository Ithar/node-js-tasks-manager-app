const chalk = require('chalk')
const mongodb = require('mongodb')

const client = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

client.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        console.log(chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'));
        console.log(chalk.red('Unable to connect to MonogoDB'));
        console.log(chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'));
        return
    }

    console.log(chalk.green('---------------------------------'));
    console.log(chalk.green('Coonected to MonogoDB port 27017'));
    console.log(chalk.green('---------------------------------'));

    const db = client.db(databaseName)
    createUsers('users', db)
    createTasks('tasks', db)

})

function createUsers(collection, db) {

    db.collection(collection).insertOne({
        name: 'admin',
        password: 'testing'
    }, (error, result) => {

        if (error) {
            return console.log(chalk.red('Failed to insert user'));
        }

        console.log(result.ops);
    })
}

function createTasks(collection, db) {

    db.collection(collection).insertOne({
        name: 'Get shopping',
        desc: 'Need to go to Lidle ',
        dueDate : '12-05-2020',
        completed : false
    }, (error, result) => {

        if (error) {
            return console.log(chalk.red('Failed to insert task'));
        }

        console.log(result.ops);
    })

}