const chalk = require('chalk')
const jwt = require('jsonwebtoken')

const AuthToken = require('../model/authtoken')
const User = require('../model/user')

const authService = {

    getSecrect()  {
        return '2TgHgZZkwBU'
    },
    getExpiresTime() {
        return '1 hour'
    },
    async generateToken(user) {
        const id = user._id.toString()
        const token = await jwt.sign({_id: id}, authService.getSecrect(), {expiresIn: authService.getExpiresTime()}) 
        authService.saveAuthToken(id, token)
        return token
    },
    async getAuthenticatedUser(req) {

        const token = req.header('Authorization').replace('Bearer ', '')
        try {
            const decoded = jwt.verify(token, authService.getSecrect())
            const userId = decoded._id; 
            const userAuth = await AuthToken.findOne({userId})
            return await User.findOne({_id: userAuth.userId})           
        } catch(e) {
            console.log(chalk.yellow('Authentication failed due to : ' + e))
            return undefined
        }
                
    },
    saveAuthToken(userId, token) {

        AuthToken.findOne({userId: userId})
        .then((authToken) => {
           
            if (!authToken) {
                authToken = new AuthToken()
                authToken.userId= userId
            }

            authToken.token = token
            authToken.save();
        }).catch( (e) =>{
            console.log(chalk.red('Failed to save user auth token for user id ' + userId))
        })
    }

}

module.exports = authService