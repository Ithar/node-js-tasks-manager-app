const chalk = require('chalk')
const jwt = require('jsonwebtoken')

const AuthToken = require('../model/authtoken')
const User = require('../model/user')

const authService = {

    getSecrect() {
        return process.env.JWT_SECRET
    },
    getExpiresTime() {
        return '1 hour'
    },
    async generateToken(user) {
        const userId = user._id.toString()
        return await jwt.sign({ _id: userId }, authService.getSecrect(), { expiresIn: authService.getExpiresTime() })
    },
    async generateAndSaveToken(user) {
        const token = await authService.generateToken(user)
        authService.saveAuthToken(user, token)
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
            console.warn(chalk.yellow('Authentication failed due to : ' + e))
            return undefined
        }

    },
    saveAuthToken(user, token) {

        const userId = user._id.toString()

        AuthToken.findOne({ userId: userId })
            .then((authToken) => {

                if (!authToken) {
                    authToken = new AuthToken()
                    authToken.userId = userId
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