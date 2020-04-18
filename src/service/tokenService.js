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

        saveAuthToken(id, token)

        return token
    },
    isVerified(id, token) {

        try {
            const token = jwt.verify(token, tokenService.getSecrect())

            // TODO [IM 20-04-18] - Get the user Id and match

        } catch(e) {
            console.log(chalk.yellow('Invalid token used'))
            return false;
        }
    },
    async saveAuthToken(id, token) {
        const authToken = new AuthToken();
        authToken.user_id= id;
        authToken.token = token
        await authToken.save();
    }

}

module.exports = tokenService