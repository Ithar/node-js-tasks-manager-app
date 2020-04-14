const dbService = require('../db/mongoose')
const Task = require('../model/task')

dbService.connect()

const taskService = {

    listUsers(res) {
        const myTask = new Task();

        dbService.findAll(myTask, res);
    },
    saveTasks(tasksJson) {
        dbService.saveUser();
    }

       // task1.save()
    //     .then((result) => {
    //         console.log(chalk.green('Task Saved'))
    //     }).catch((error) => {
    //         console.log(chalk.red('Error failed to save task'))
    //     })


}

module.exports = taskService