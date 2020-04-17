const chalk = require('chalk');
const dbService = require('../db/mongoose')
const Task = require('../model/task')

dbService.connect()

const taskService = {

    listTasks(res) {
        dbService.findAll(Task, res);
    },
    findTask(req, res) {
        const id = req.params.id
        dbService.findById(Task, id, res)
    },
    saveTasks(req, res) {
        const task = new Task(req.body);
        dbService.save(task, res);
    },
    deleteTask(req, res) {
        const id = req.params.id
        console.log(chalk.blue('Deleting task by id' + id));

        dbService.deleteAndCount(Task, id, {})
        .then((dto) => {

            const task = dto.model
            const count = dto.count
            
            if (task) {
                res.send({
                    success: true,
                    msg: 'Task with id ' + task.id + ' was deleted successfully. [' + count + '] tasks remaining'
                })
            } else {
                res.status(404).send({
                    success: false,
                    msg: 'Unable to delete cannot find task with id ' + id + '. [' + count + '] tasks remaining.'
                })
            }
        })
        .catch((e) => {
            res.status(500).send({
                success: false,
                error: 'An error occured trying to delete task due to ' + e 
            })
        })        
    }
}

module.exports = taskService