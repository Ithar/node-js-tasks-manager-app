const chalk = require('chalk')
const express = require('express')
const userRouter = require('./routers/usersRouter')
const taskRouter = require('./routers/taskssRouter')

const port = process.env.PORT || 3000
const app = express()

// ##########
// Settings
// ##########
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('\n---------------------------------------------------')
    console.log('|' + chalk.blue(' Express server is up and running on port: ' +  chalk.green(port) +' ! ') + '|');
    console.log('---------------------------------------------------\n')
})