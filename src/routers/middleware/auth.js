const chalk = require('chalk')

const authService = require('./../../service/authService')

const auth = async (req, res, next) => {

    try {
        const user = await authService.getAuthenticatedUser(req)

        if (!user) {
            console.log(chalk.yellow('User is not authenticated'))
            throw new Error()
        }

        req.user = user
        console.log(chalk.blue('User successfully authenticated [id= ' + user._id + ', name= ' + user.username + ']'))
        next()
    } catch (e) {

        res.status(401).send({
            success: false,
            msg: 'Operation requires authentication'
        })
    }


}

module.exports = auth
