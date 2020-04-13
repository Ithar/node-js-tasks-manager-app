const chalk = require('chalk')
const mongodb = require('mongodb')

const client = mongodb.MongoClient
const ObjectId = mongodb.ObjectID

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
    // createUsers('users', db)
    // createTasks('tasks', db)
    //searchUserByName('bob', db)
    //searchUserById('5e93587a86ae1642483ded1a', db)
    //updateUserById('5e93587a86ae1642483ded1a', db)
    //deleteUsersByIds(['5e93587a86ae1642483ded1a'], db)

    //searchTasksByDate('12-05-2020', db)
    //completeTasks(['5e93587a86ae1642483ded1b', '5e941a77bc087c42405285e1'], true, db)

})

function deleteUsersByIds(ids, db) {

    db.collection('users').deleteMany({ _id: {$in: [new ObjectId(ids[0])]} })
    .then((result) => {

        if (result.deletedCount ===  0) {
            console.log('Nothing delted')
        } else {
            console.log('Deleted [' + result.deletedCount + '] records')
        }

    }).catch((error) => {
        console.log('Failed to delete records due to:' + error)
    })
}


function completeTasks(ids, completed, db) {

    db.collection('tasks').updateMany({ _id: {$in: [new ObjectId(ids[0]), new ObjectId(ids[1])]} }, {
        $set: {
            completed: true
        }
    }).then((result) => {

        if (result.modifiedCount ===  0) {
            console.log('Nothing updated')
        } else {
            console.log('Updated [' + result.modifiedCount + '] records')
        }

    }).catch((error) => {
        console.log('Failed to update records due to:' + error)
    })
}


function updateUserById(id, db) {

    db.collection('users').updateOne({ _id: new ObjectId(id) }, {
        $set: {
            password: 'admin#123'
        }
    }).then((result) => {

        if (result.modifiedCount === 1) {
            console.log('Update successful')
        } else {
            console.log('Nothing updated')
        }

    }).catch((error) => {
        console.log('Failed to update user with id ' + id + ' due to:' + error)
    })

}

function searchTasksByDate(date, db) {

    db.collection('tasks').find({ dueDate: date }).toArray((error, tasks) => {

        if (error) {
            return console.log('Cannot find tasks by date : ' + data);
        }

        console.log(tasks)

    })

}

function searchUserById(id, db) {


    // db.collection('users').findOne({_id: new ObjectId(id)}, (error, user) => {

    //     if (error) {
    //         return console.log('Cannot find user by id: ' +  id);
    //     }

    //     console.log(user);
    // })

    db.collection('users').findOne({ _id: new ObjectId(id) })
        .then((result) => {

            if (result) {
                console.log('User found:' + result.name);
            } else {
                console.log('User NOT found with id ' + id);
            }

        }).catch((error) => {
            console.log('An error occured tring to find user by id: ' + id) + ' due to ' + error;
        })

}


function searchUserByName(username, db) {


    db.collection('users').findOne({ name: username }, (error, user) => {

        if (error) {
            return console.log('Cannot find user by username: ' + username);
        }

        console.log(user);
    })
}

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
        dueDate: '12-05-2020',
        completed: false
    }, (error, result) => {

        if (error) {
            return console.log(chalk.red('Failed to insert task'));
        }

        console.log(result.ops);
    })

}