const chalk = require('chalk')
const express = require('express')
const userService = require('./service/userService')
const taskService = require('./service/taskService')

const app = express()
const port =  process.env.PORT || 3000

// ##########
// Settings
// ##########
app.use(express.json())

// ###########
// REST APIS
// ###########

// Users 
app.get('/users', (req, res) => {
    userService.listUsers(res);
})
app.post('/user', (req, res) => {
    userService.saveUser(req, res);
})
app.get('/user/:id', (req, res) => {
    userService.findUser(req, res);
})
app.delete('/user:id', (req, res) => {
    userService.delete(res);
})
app.patch('/user/:id', (req, res) => {
    userService.updateUser(req, res);
})

// Tasks
app.get('/tasks', (req, res) => {
    taskService.listTasks(res)    
})
app.post('/task', (req, res) => {
    taskService.saveTasks(req, res)    
})
app.get('/task/:id', (req, res) => {
    taskService.findTask(req, res);
})
app.delete('/task/:id', (req, res) => {
    taskService.deleteTask(req, res);
})
app.patch('/task/:id', (req, res) => {
    taskService.updateTask(req, res);
})




app.listen(port, () => {
    console.log('\n---------------------------------------------------')
    console.log('|' + chalk.blue(' Express server is up and running on port: ' +  chalk.green(port) +' ! ') + '|');
    console.log('---------------------------------------------------\n')
})