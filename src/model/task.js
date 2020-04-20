const mongoose = require('mongoose')

const taskSchemaOptions = {
    timestamps : true
}

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    dueDate: {
        type: Date,
        default: new Date()
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User'
    }
}, taskSchemaOptions)

// Instance methods 
taskSchema.methods.toJSON = function () {
    const task = this

    const taskJson = task.toObject()
    taskJson.id = taskJson._id
    
    delete taskJson._id
    delete taskJson.__v
    delete taskJson.userId

    return taskJson
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task