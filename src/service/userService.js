const chalk = require('chalk')
const dbService = require('./../db/mongoose')
const User = require('./../model/user')

dbService.connect()

const userService = {

    listUsers(res) {

        try {
            dbService.findAll(User, res)
        } catch (err) {
            console.log(chalk.red('Failed to list users.'))
            res.status(500).send({
                error: 'Failed to list users'
            })
        }

    },
    findUser(req, res) {

        dbService.findById(User, req.params.id , res)

    },
    saveUser(req, res) {

        
        const user = new User(req.body)

        // TODO [IM 14-04-20] - check email before save
        
        dbService.save(user, res);
    }

}

module.exports = userService