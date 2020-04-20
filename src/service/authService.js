const chalk = require('chalk')
const jwt = require('jsonwebtoken')

const AuthToken = require('../model/authtoken')
const User = require('../model/user')

const authService = {

    getSecrect() {
        return '2TgHgZZkwBU'
    },
    getExpiresTime() {
        return '1 hour'
    },
    async generateToken(user) {
        const userId = user._id.toString()
        const token = await jwt.sign({ _id: userId }, authService.getSecrect(), { expiresIn: authService.getExpiresTime() })
        authService.saveAuthToken(userId, token)
        return token
    },
    async getAuthenticatedUser(req) {

        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, authService.getSecrect())
            const userId = decoded._id;
            const userAuth = await AuthToken.findOne({ userId })
            return await User.findOne({ _id: userAuth.userId })
        } catch (e) {
            console.log(chalk.yellow('Authentication failed due to : ' + e))
            return undefined
        }

    },
    saveAuthToken(userId, token) {

        AuthToken.findOne({ userId: userId })
            .then((authToken) => {

                if (!authToken) {
                    authToken = new AuthToken()
                    authToken.userId = userId
                    console.log(chalk.blue('User authenticated [id= ' + userId + ']'))
                }

                authToken.token = token
                authToken.save();
            }).catch((e) => {
                console.log(chalk.red('Failed to save user auth token for user id ' + userId))
            })
    },
    async expireAuthToken(req) {

        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const decoded = jwt.verify(token, authService.getSecrect())
            const userId = decoded._id;
            await AuthToken.deleteOne({ userId })
            return true
        } catch (e) {
            console.log(chalk.yellow('Authentication expiring failed due to : ' + e))
            return false
        }

    }


}

module.exports = authService