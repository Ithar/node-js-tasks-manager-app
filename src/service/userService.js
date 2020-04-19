const chalk = require('chalk')
const dbService = require('./../db/mongoose')
const tokenService = require('./../service/tokenService')
const User = require('./../model/user')

dbService.connect()

const userService = {

    listUsers(res) {

        try {
            dbService.findAll(User)
                .then((user) => {
                    res.send(user)
                })
                .catch((err) => {
                    console.log(chalk.red('Failed to list users due to: ' + err))
                    res.status(500).send({
                        success: false,
                        error: 'Unbale to list tasks at present'
                    })
                })
        } catch (err) {
            console.log(chalk.red('Failed to list users due to.' + err))
            res.status(500).send({
                error: 'Failed to list users'
            })
        }

    },
    findUser(req, res) {

        const id = req.params.id
        console.log(chalk.blue('Find user by id:' + id))
        dbService.findById(User, id)
            .then((user) => {

                if (!user) {
                    return res.status(404).send({
                        success: false,
                        message: 'User not found by id:' + id
                    })
                }

                res.send(user)

            })
            .catch((err) => {
                console.log(chalk.red('Failed to find user by id due to: ' + err))
                res.status(500).send({
                    success: false,
                    error: 'Unbale to user find by id at present'
                })
            })

    },
    saveUser(req, res) {

        console.log(chalk.blue('Creating user'))

        const user = new User(req.body)
        // TODO [IM 14-04-20] - check email before save

        dbService.save(user)
            .then(async (user) => {

                const token = await tokenService.generateToken(user)
                
                res.status(201).send({
                    name: user.username,
                    email : user.email,
                    token : token
                })
            }).catch((err) => {

                if (err.errors !== undefined) {
                    return res.status(400).send({
                        success: false,
                        message: 'Failed to create a user.',
                        error: err.errors
                    })
                }

                res.status(500).send({
                    success: false,
                    error: 'Failed to save user'
                })
            })
    },
    deleteUser(req, res) {
        const id = req.params.id
        console.log(chalk.blue('Deleting user by id' + id));

        dbService.delete(User, id, {})
            .then((user) => {

                if (user) {
                    res.send({
                        success: true,
                        msg: 'User with id ' + user.id + ' was deleted successfully.'
                    })
                } else {
                    res.status(404).send({
                        success: false,
                        msg: 'Unable to delete cannot find user with id ' + id
                    })
                }
            })
            .catch((e) => {
                res.status(500).send({
                    success: false,
                    error: 'An error occured trying to delete user due to ' + e
                })
            })
    },
    updateUser(req, res) {
        const id = req.params.id
        const body = req.body

        console.log(chalk.blue('Updateing user with id' + id))

        const updateKeys = Object.keys(body);

        if (!this.isValidUpdate(updateKeys)) {
            res.status(400).send({
                success: false,
                msg : 'Invalid updates fields'
            })
        }

        dbService.findAndUpdate(User, id, body, updateKeys)
            .then(user => {

                if (user === undefined) {
                    res.status(404).send({
                        success: false,
                        msg: 'Cannot update user not found with id ' + id
                    })
                }

                res.send(user)
            })
            .catch((e) => {
                res.status(500).send({
                    success: false,
                    error: 'An error occured trying to update a user due to ' + e
                })
            })
    },
    isValidUpdate(updateKeys) {
        const allowedKeys = ['username', 'email', 'password']
        return updateKeys.every((update) => allowedKeys.includes(update))
    }, 
    async loginUser(req, res) {

        const email = req.body.email
        const  password = req.body.password

        console.log(chalk.blue('Attempting to login user with email: ' + email))

        try {
            const user = await User.findByCredentials(email, password)
            const token = await tokenService.generateToken(user)
            
            res.send({
                name : user.username,
                email : user.email,
                token : token
            })
        } catch(e) {
            res.status(400).send({
                success: false,
                error: e.message
            })
        }
        
    }
}

module.exports = userService