const chalk = require('chalk');
const dbService = require('../db/mongoose')
const Task = require('../model/task')

dbService.connect()

const taskService = {

    listTasks(res) {
        console.log(chalk.blue('Listing tasks ... '))

        dbService.findAll(Task, res)
            .then((task) => {
                res.send(task)
            })
            .catch((err) => {
                console.log(chalk.red('Failed to list tasks due to: ' + err))
                res.status(500).send({
                    success: false,
                    error: 'Unbale to list tasks at present'
                })
            })
    },
    findTask(req, res) {
        const id = req.params.id
        console.log(chalk.blue('Find task by id:' + id))
        dbService.findById(Task, id)
            .then((task) => {

                if (!task) {
                    return res.status(404).send({
                        success: false,
                        message: 'Task not found by id:' + id
                    })
                }

                res.send(task)

            })
            .catch((err) => {
                console.log(chalk.red('Failed to find task by id due to: ' + err))
                res.status(500).send({
                    success: false,
                    error: 'Unbale to task find by id at present'
                })
            })
    },
    saveTasks(req, res) {
        const task = new Task(req.body);
        console.log(chalk.blue('Create a task'))
        dbService.save(task, res)
            .then((task) => {
                res.status(201).send(task)
            }).catch((err) => {

                if (err.errors !== undefined) {
                    return res.status(400).send({
                        success: false,
                        message: 'Failed to create task.',
                        error: err.errors
                    })
                }

                res.status(500).send({
                    success: false,
                    error: 'Failed to save task'
                })
            })
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
    },
    updateTask(req, res) {
        const id = req.params.id
        const body = req.body

        console.log(chalk.blue('Updateing task with id' + id))

        dbService.update(Task, id, body)
            .then(task => {

                if (!user) {
                    res.status(404).send({
                        success: false,
                        msg: 'Cannot update task not found with id ' + id
                    })
                }

                res.send(user)
            })
            .catch((e) => {
                res.status(500).send({
                    success: false,
                    error: 'An error occured trying to update a task due to ' + e
                })
            })
    }
}

module.exports = taskService