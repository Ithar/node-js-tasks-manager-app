const mongoose = require('mongoose')
const validator = require('validator')
const passwordValidator = require('password-validator')

const passwordSchema = setUpPasswordSehcma();

const User = mongoose.model('User', {
    username: {
        type: String,
        default: 'anonymous',
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                console.log('EMAIL -- ERROR --');
                throw new Error('Please enter a valid email');
            } else {
                console.log('EMAIL -- OK --');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(pwd) {
            if (!passwordSchema.validate(pwd)) {
                throw new Error('Password does not meet criteria');
            }
        }
    },
    loginCount: { 
        type: Number,
        default: 0
    }
})

function setUpPasswordSehcma() {

    var schema = new passwordValidator();

    schema
        .is().min(7)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Password', 'Passw0rd', 'Password123']); // Blacklist 

    return schema
}

module.exports = User