const chalk = require('chalk')
const mongoose = require('mongoose')
const validator = require('validator')
const passwordValidator = require('password-validator')
const bcrypt = require('bcryptjs')

const userSchemaOptions = {
    timestamps : true
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
        unique: true,
        lowercase: true,
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
    failedLoginCount: { 
        type: Number,
        default: 0
    },
    avatar : {
        type: Buffer
    }
}, userSchemaOptions)

// PRE/POST Hooks
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }   
    
    next() // informs the hook is completed it's work
})

// INSTANCE methods 
userSchema.methods.toJSON = function () {
    const user = this

    const userJson = user.toObject() 

    delete userJson._id
    delete userJson.__v
    delete userJson.password
    delete userJson.failedLoginCount
    delete userJson.createdAt
    delete userJson.updatedAt
    userJson.avatar = '/user/' + user._id + '/avatar'

    return userJson
}

// STATIC methods 
userSchema.statics.findByCredentials = async (email, pwd) => {
    const user = await User.findOne({email})

    if (!user) {
        console.warn(chalk.yellow('No user found with email:' + email))
        throw new Error('Unable to login, user not found')
    }
    
    const isMatch = await bcrypt.compare(pwd, user.password)

    if (!isMatch) {
        console.warn(chalk.yellow('User found but password mismatch ' + pwd))
        throw new Error('Unable to login password mismatch.')
    }

    console.info(chalk.blue('User login passed for email: ' + email))

    return user
}

// Virtual References 
userSchema.virtual('myTasks', {
    ref: 'Task',
    localField : '_id',
    foreignField: 'userId'
})

const User = mongoose.model('User', userSchema)

// Password Validation 
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

module.exports = User