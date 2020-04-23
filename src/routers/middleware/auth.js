const chalk = require('chalk')

const authService = require('./../../service/authService')

const auth = async (req, res, next) => {

    try {
        const user = await authService.getAuthenticatedUser(req)

        if (!user) {
            console.warn(chalk.yellow('User is not authenticated'))
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {

        res.status(401).send({
            success: false,
            msg: 'Operation requires authentication'
        })
    }


}

module.exports = auth
