const chalk = require('chalk')
const jwt = require('jsonwebtoken')
const AuthToken = require('./../model/authtoken')

const tokenService = {

    getSecrect()  {
        return '2TgHgZZkwBU'
    },
    getExpiresTime() {
        return '15 minutes'
    },
    async generateToken(user) {
        const id = user._id.toString()
        const token = await jwt.sign({_id: id}, tokenService.getSecrect(), {expiresIn: tokenService.getExpiresTime()}) 
        tokenService.saveAuthToken(id, token)
        return token
    },
    isVerified(userId, token) {

        try {
            const matchedToken = jwt.verify(token, tokenService.getSecrect())

            // TODO [IM 20-04-18] - Get the user Id and match

        } catch(e) {
            console.log(chalk.yellow('Invalid token used'))
            return false;
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

module.exports = tokenService