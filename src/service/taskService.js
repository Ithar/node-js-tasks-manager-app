const dbService = require('../db/mongoose')
const Task = require('../model/task')

dbService.connect()

const taskService = {

    listTasks(res) {
        dbService.findAll(Task, res);
    },
    findTask(req, res) {
        dbService.findById(Task, req.params.id, res)
    },
    saveTasks(req, res) {
        
        const task = new Task(req.body);

        dbService.save(task, res);
    }

}

module.exports = taskService