const chalk = require('chalk')
const sharp = require('sharp')
const dbService = require('./../db/mongoose')
const authService = require('./authService')
const taskService = require('./taskService')
const emailService = require('./emailService')

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
    async createUser(req, res) {

        console.info(chalk.blue('Creating a new user'))

        const user = new User(req.body)
        // TODO [IM 14-04-20] - check email before save

        try {
            const createdUser = await dbService.save(user)
            const token = await authService.generateAndSaveToken(createdUser)
            emailService.sendWelcomeEmail(createdUser)
            res.status(201).send({
                user: createdUser,
                token: token
            })
        } catch(e) {
            if (e.errors !== undefined) {
                return res.status(400).send({
                    success: false,
                    message: 'Failed to create a user.',
                    error: e.errors
                })
            }

            res.status(500).send({
                success: false,
                error: 'Failed to save user'
            })
        }
    },
    deleteUser(req, res) {
        const user = req.user
        const id = user._id

        console.info(chalk.blue('Deleting user by id' + id));

        dbService.delete(user)
            .then((user) => {

                if (user) {
                    authService.expireAuthToken(req)
                    taskService.deleteTasksByUser(user)
                    res.send({
                        success: true,
                        msg: 'You have successfully deleted your account'
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
    async updateUser(req, res) {
        const user = req.user
        const body = req.body
        const id = user.id

        console.info(chalk.blue('Updateing user with id:' + id))

        const updateFields = Object.keys(body);

        if (!this.isValidUpdate(updateFields)) {
            return res.status(400).send({
                success: false,
                msg: 'Invalid updates fields user'
            })
        }

        try {
            const updatedUser = await dbService.update(user, body, updateFields)
            res.send(updatedUser)

        } catch (e) {
            console.log(chalk.red('An error occured trying to update a user due to ' + e))
            res.status(500).send({
                success: false,
                error: 'Cannot update at present, please try later '
            })
        }
    },
    async saveAvatar(req, res) {
        const user = req.user
        const image =  await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer() 

        user.avatar = image

        try {
            await dbService.save(user)
            res.send({
                success: true,
                msg : 'Avatar saved to user'
            })
        } catch(e) {
            console.log(chalk.red('Cannot save avatar due to ' + e))
            res.status(500).send({
                success: false,
                error: 'Cannot upload avatar, please try later '
            })
        }
    },
    isValidUpdate(updatedFields) {
        const allowedFields = ['username', 'email', 'password', 'avatar']
        return updatedFields.every((field) => allowedFields.includes(field))
    },
    async loginUser(req, res) {

        const email = req.body.email
        const password = req.body.password

        console.info(chalk.blue('Attempting to login user with email: ' + email))

        try {
            const user = await User.findByCredentials(email, password)
            const token = await authService.generateAndSaveToken(user)

            res.send({
                user: user,
                token: token
            })
        } catch (e) {
            console.error(chalk.red('Failed to login user due to: ' + e))
            res.status(400).send({
                success: false,
                error: e.message
            })
        }
    },
    async logoutUser(req, res) {

        const success = await authService.expireAuthToken(req)

        console.log(chalk.blue('User logout success : ' + success))

        if (success) {
            res.send({
                success: true,
                msg: 'User successfully logout'
            })
        } else {
            res.status(400).send({
                success: false,
                msg: 'Unable to logout at present'
            })
        }

    }
}

module.exports = userService