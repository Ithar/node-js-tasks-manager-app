const mongoose = require('mongoose')

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

module.exports = Task