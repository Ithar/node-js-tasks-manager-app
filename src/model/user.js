const chalk = require('chalk')
const mongoose = require('mongoose')
const validator = require('validator')
const passwordValidator = require('password-validator')
const bcrypt = require('bcryptjs')

const passwordComposition = setPasswordComposition();

function setPasswordComposition() {

    var pwdValidator = new passwordValidator();

    pwdValidator
        .is().min(7)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Password', 'Passw0rd', 'Password123']); // Blacklist 

    return pwdValidator
}

const userSchema = new mongoose.Schema({
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
                throw new Error('Please enter a valid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(pwd) {
            if (!passwordComposition.validate(pwd)) {
                throw new Error('Password does not meet criteria');
            }
        }
    },
    loginCount: { 
        type: Number,
        default: 0
    }
})

userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
        console.log(chalk.blue('Password has been hashed'))
    }   
    
    next() // informs the hook is completed it's work
})

const User = mongoose.model('User', userSchema)

module.exports = User