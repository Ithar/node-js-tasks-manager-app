const request = require('supertest')
const mongoose = require('mongoose')

const mockData = require('./fixtures/mockData')
const Task = require('../src/model/task')
const app = require('../src/app')

let mockUser1;
let mockUser2;

beforeEach(async () => {

    jest.spyOn(console, 'info').mockImplementation(() => { })
    jest.spyOn(console, 'warn').mockImplementation(() => { })
    jest.spyOn(console, 'error').mockImplementation(() => { })

    await mockData.init()
    mockUser1 = await mockData.getMockUser1()
    mockUser2 = await mockData.getMockUser2()
    
})

afterAll((done) => {
    mockData.tearDown();
    done()
})

// List 
test('Task: Should list tasks', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send()
        .expect(200)

        expect(response.body[0].name).toBe('Mock task 1')
})

// Find  
test('Task: Should find task', async () => {

    const taskId = mockUser1.task._id
    
    const response = await request(app).get('/task/'+ taskId)
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send()
        .expect(200)
})

// Create 
test('Task: Should create task', async () => {
    const response = await request(app).post('/task')
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send({
            name: 'Creating a new task',
            desc: 'New task is created'
        }).expect(201)

        const task = await Task.findById(response.body.id)
        expect(task).not.toBeNull()
})

// Update 
test('Task: Should update task', async () => {

    const taskId = mockUser1.task._id
    const taskName = 'Mock task 1 UPDATEED'

    await request(app).patch('/task/'+ taskId)
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send({
            name: taskName
        }).expect(200)

        const taskUpdated = await Task.findById(taskId)
        expect(taskUpdated.name).toBe(taskName)
})

// Delete
test('Task: Should delete task', async () => {

    const taskId = mockUser1.task._id
    await request(app).delete('/task/'+ taskId)
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send().expect(200)

        const taskUpdated = await Task.findById(taskId)
        expect(taskUpdated).toBeNull()
})