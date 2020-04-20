const express = require('express')
const router = new express.Router()

const taskService = require('../service/taskService')
const auth = require('./../routers/middleware/auth')

// Tasks

// Get Tasks 
router.get('/tasks', auth, (req, res) => {
    taskService.listTasks(req, res)    
})

// Get Single Task
router.get('/task/:id', auth, (req, res) => {
    taskService.findTask(req, res);
})

// Create Task
router.post('/task', auth, (req, res) => {
    taskService.saveTasks(req, res)    
})

// Update Task
router.patch('/task/:id', auth, (req, res) => {
    taskService.updateTask(req, res);
})

// Delete Task
router.delete('/task/:id', auth, (req, res) => {
    taskService.deleteTask(req, res);
})


module.exports = router