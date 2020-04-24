const mongoose = require('mongoose')

const authService = require('../../src/service/authService')
const User = require('../../src/model/user')
const AuthToken = require('../../src/model/authtoken')
const Task = require('../../src/model/task')

const mockUser1 = {
    username: 'Test User 1',
    email: 'test.user1@test.com',
    password: 'Test#123'
}

const mockUser2 = {
    username: 'Test User 2',
    email: 'test.user2@test.com',
    password: 'Test#123'
}

const mockData = {

    async init() {

        await User.deleteMany()
        await AuthToken.deleteMany()
        const savedUser1 = await new User(mockUser1).save()
        const savedUser2 = await new User(mockUser2).save()

        const token = await authService.generateToken(savedUser1)
        const token2 = await authService.generateToken(savedUser2)

        mockUser1.token = token
        mockUser2.token = token2

        await new AuthToken({
            userId: savedUser1._id,
            token: token
        }).save()

        await new AuthToken({
            userId: savedUser2._id,
            token: token2
        }).save()

        const task = mockData.getMockTask(savedUser1)
        const savedTask = await new Task(task).save() 
        mockUser1.task = savedTask
    },
    getMockTask(savedUser1) {
        return {
            userId : savedUser1._id,
            name: 'Mock task 1',
            desc: 'Mock desc',
        }
    },
    async getMockUser1() {
        return mockUser1;
    },
    async getMockUser2() {
        return mockUser2;
    },
    async tearDown() {
        // Closing the DB connection allows Jest to exit successfully.
        mongoose.connection.close()
    }
}

module.exports = mockData