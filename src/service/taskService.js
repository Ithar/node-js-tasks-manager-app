const chalk = require('chalk');
const dbService = require('../db/mongoose')
const Task = require('../model/task')

dbService.connect()

const taskService = {

    async listTasks(req, res) {
        console.log(chalk.blue('Listing tasks ... '))

        const user = req.user
        const match = await taskService.getQueryPrams(req)

        try {
            await user.populate({
                path: 'myTasks',
                match
            }).execPopulate()

            res.send(user.myTasks)
        } catch (err) {
            console.log(chalk.red('Failed to list tasks due to: ' + err))
            res.status(500).send({
                success: false,
                error: 'Unbale to list tasks at present'
            })
        }
    },
    async getQueryPrams(req) {

        const match = {}

        if (req.query.completed) {
            match.completed = (req.query.completed === 'true') ? true : false;
        }

        return match
    },
    async findTask(req, res) {
        const taskId = req.params.id
        console.log(chalk.blue('Find task by id:' + taskId))

        const user = req.user

        try {
            await user.populate('myTasks').execPopulate()
            const task = user.myTasks.filter((task) => task.id === taskId)
            res.send(task)
        } catch (err) {
            console.log(chalk.red('Failed to find task by id due to: ' + err))
            res.status(500).send({
                success: false,
                error: 'Unbale to task find by id at present'
            })
        }
    },
    async saveTasks(req, res) {
        console.log(chalk.blue('Creating a task'))

        const task = new Task(req.body);
        task.userId = req.user._id

        try {
            const savedTask = await dbService.save(task);
            res.status(201).send(savedTask)
        } catch (err) {

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
        }
    },
    async deleteTask(req, res) {
        const taskId = req.params.id
        const user = req.user
        console.log(chalk.blue('Deleting task by id' + taskId));

        try {

            const task = await dbService.findOne(Task, { _id: taskId, userId: user._id })

            if (task) {
                const dto = await dbService.deleteAndCount(Task, task._id, { userId: user._id })
                const count = dto.count

                res.send({
                    success: true,
                    msg: 'Task with id ' + taskId + ' was deleted successfully. [' + count + '] tasks remaining'
                })
            } else {
                res.status(404).send({
                    success: false,
                    msg: 'Unable to delete cannot find task with id ' + taskId + '. [' + count + '] tasks remaining.'
                })
            }

        } catch (e) {
            console.log(chalk.red('Delete failed due to ' + e))
            res.status(500).send({
                success: false,
                error: 'An error occured trying to delete a task'
            })
        }
    },
    deleteTasksByUser(user) {

        console.log(chalk.blue('Deleting all tasks for user: ' + user._id))
        try {
            dbService.deleteAll(Task, { userId: user._id })
        } catch (e) {
            console.log(chalk.red('Failed to deleting all tasks due to ' + e))
        }

    },
    async updateTask(req, res) {
        const taskId = req.params.id
        const body = req.body
        const user = req.user

        console.log(chalk.blue('Updateing task with id' + taskId))

        const updateFields = Object.keys(body);

        if (!taskService.isValidUpdate(updateFields)) {
            res.status(400).send({
                success: false,
                msg: 'Invalid updates fields for task'
            })
        }

        try {
            const task = await dbService.findOne(Task, { _id: taskId, userId: user._id })

            if (!task) {
                return res.status(404).send({
                    success: false,
                    msg: 'Cannot update task not found with id ' + id
                })
            }

            const updatedTask = await dbService.update(task, body, updateFields)
            res.send(updatedTask)

        } catch (e) {
            console.log(chalk.red('Delete failed due to ' + e))
            res.status(500).send({
                success: false,
                error: 'An error occured trying to update a task '
            })
        }
    },
    isValidUpdate(updatedFields) {
        const allowedFields = ['name', 'desc', 'dueDate', 'completed']
        return updatedFields.every((field) => allowedFields.includes(field))
    }
}

module.exports = taskService