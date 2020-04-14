const chalk = require('chalk')
const mongoose = require('mongoose')
const validator = require('validator')
const passwordValidator = require('password-validator')

const passwordSchema = setUpPasswordSehcma()

mongoose.connect('mongodb://127.0.0.1:27017/task-manager', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

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
        validate(emial) {
            if (!validator.isEmail(emial)) {
                throw new Error('Please enter a valid emial');
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
    loginCount: { type: Number }
})

const user1 = new User({
    username: 'jane doe',
    email: 'john.doe@test.com',
    password: 'admin#123',
    loginCount: 0
})

user1.save()
    .then((result) => {
        console.log(chalk.green('User Saved'))
    }).catch((error) => {
        console.log(chalk.red('Error failed to save user due to:\n'))
        console.log(chalk.red('- ' + error.errors.password.message))
    })

const Task = mongoose.model('Task', {
    name: { 
        type: String,
        required: true
    },
    desc: { type: String },
    dueDate: { 
        type: Date,
        default: new Date()
     },
    completed: { 
        type: Boolean,
        default: false
    }
})

// const task1 = new Task({
//     name: 'Mongoose',
//     desc: 'Learb mongoose library',
//     dueDate: new Date(),
//     completed: false
// })

// task1.save()
//     .then((result) => {
//         console.log(chalk.green('Task Saved'))
//     }).catch((error) => {
//         console.log(chalk.red('Error failed to save task'))
//     })


function setUpPasswordSehcma() {

    var schema = new passwordValidator();

    schema
        .is().min(7)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        //.has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Password', 'Passw0rd', 'Password123']); // Blacklist 

    return schema
}