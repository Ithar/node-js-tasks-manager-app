const mongoose = require('mongoose')
//const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const User = mongoose.model('User', {
    username: { type: String },
    email: { 
        type: String,
        required: true,
        validate(val) {
            // if (!validator.isEmail(val))  {
            //     throw new Error('Please enter a valid emial');
            // }
        }
    },
    password: { 
        type: String,
        required: true 
    },
    loginCount: { type: Number }
})

const user1 = new User({
    username: 'jane doe',
    email: 'jane.doe@ test.com',
    password: 'admin#123',
    loginCount: 0
})

user1.save()
    .then((result) => {
        console.log('User Saved')
    }).catch((error) => {
        console.log('Error failed to save user')
    })


// const Task = mongoose.model('Task', {
//     name: { type: String },
//     desc: { type: String },
//     dueDate: { type: Date },
//     completed: { type: Boolean }
// })

// const task1 = new Task({
//     name: 'Mongoose',
//     desc: 'Learb mongoose library',
//     dueDate: new Date(),
//     completed: false
// })

// task1.save()
//     .then((result) => {
//         console.log('Task Saved')
//     }).catch((error) => {
//         console.log('Error failed to save task')
//     })


