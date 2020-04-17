const express = require('express')
const taskService = require('../service/taskService')
const router = new express.Router()

// Tasks
router.get('/tasks', (req, res) => {
    taskService.listTasks(res)    
})
router.post('/task', (req, res) => {
    taskService.saveTasks(req, res)    
})
router.get('/task/:id', (req, res) => {
    taskService.findTask(req, res);
})
router.delete('/task/:id', (req, res) => {
    taskService.deleteTask(req, res);
})
router.patch('/task/:id', (req, res) => {
    taskService.updateTask(req, res);
})

module.exports = router