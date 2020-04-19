const mongoose = require('mongoose')

const AuthToken = mongoose.model('AuthToken', {
    userId: { 
        type: String,
        required: true
    },
    token: { 
        type: String,
        required: true
    }
})

module.exports = AuthToken