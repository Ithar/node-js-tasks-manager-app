const chalk = require('chalk')
const express = require('express')

const app = express()
const port =  process.env.PORT || 3000




app.listen(port, () => {
    console.log('\n---------------------------------------------------')
    console.log('|' + chalk.blue(' Express server is up and running on port: ' +  chalk.green(port) +' ! ') + '|');
    console.log('---------------------------------------------------\n')
})