const express = require('express')
const userRouter = require('./routers/usersRouter')
const taskRouter = require('./routers/taskssRouter')

const app = express()

// ##########
// Settings
// ##########
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app