const dbService = require('../db/mongoose')
const Task = require('../model/task')

dbService.connect()

const taskService = {

    listUsers(res) {
        const myTask = new Task();

        dbService.findAll(myTask, res);
    },
    saveTasks(req, res) {
        
        const task = new Task(req.body);

        dbService.save(task, res);
    }



}

module.exports = taskService