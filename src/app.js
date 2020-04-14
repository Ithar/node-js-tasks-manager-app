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

// Tasks
app.post('/tasks', (req, res) => {
    taskService.saveTasks(req, res)    
})


app.listen(port, () => {
    console.log('\n---------------------------------------------------')
    console.log('|' + chalk.blue(' Express server is up and running on port: ' +  chalk.green(port) +' ! ') + '|');
    console.log('---------------------------------------------------\n')
})