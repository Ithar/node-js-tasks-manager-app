const request = require('supertest')

const mockData = require('./fixtures/mockData')
const User = require('../src/model/user')
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

// Login 
test('User: Should login user', async () => {
    await request(app).post('/user/login')
        .send({
            email: mockUser1.email,
            password: mockUser1.password
        }).expect(200)
})

test('User: Should not login user with invalid email', async () => {
    await request(app).post('/user/login')
        .send({
            email: "fakeemail@test.com",
            password: mockUser1.password
        }).expect(400)
})

test('User: Should not login user with invalid password', async () => {
    await request(app).post('/user/login')
        .send({
            email: mockUser1.email,
            password: "Invalid#123"
        }).expect(400)
})

// Profile 
test('User: Should NOT get user profile', async () => {
    await request(app).get('/user/me')
        .set('Authorization', `Bearer invalid.jwt.eyJhbGciOiJIUzI1NiIsInR5cC`)
        .send()
        .expect(401)
})

test('User: Should get user profile', async () => {
    const response = await request(app).get('/user/me')
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send()
        .expect(200)  
})

// List 
test('User: Should list all users', async () => {
    await request(app).get('/users')
        .send()
        .expect(200)
})

// Create
test('User: Should create new user', async () => {

    const testEmail = "jane.doe@test.com"

    const response = await request(app).post('/user')
        .send({
            "username": "Jane Doe",
            "email": testEmail,
            "password": "Test#123"
        }).expect(201)

    expect(response.body.user.email).toBe(testEmail)
    expect(response.body.token).not.toBeNull()
})

// Update 
test('User: Should update user', async () => {

    const usernameUpdate = 'Test User 1 UPDATED'

    const response = await request(app).patch('/user')
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send({
            "username": usernameUpdate
        }).expect(200)
        
        expect(response.body.username).toBe(usernameUpdate)
})

test('User: Should not update user', async () => {

    const response = await request(app).patch('/user')
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .send({
            "invalid_field": "Bad request"
        }).expect(400)
})

// Delete 
test('User: Should NOT delete user', async () => {
    await request(app).delete('/user')
        .send()
        .expect(401)
})

test('User: Should delete user', async () => {
    await request(app).delete('/user')
        .set('Authorization', `Bearer ${mockUser2.token}`)
        .send()
        .expect(200)

    const user = await User.findById(mockUser2._id)
    expect(user).toBeNull()
})

// Avatar 
test('User: Should upload image', async () => {
    await request(app).post('/user/me/avatar')
        .set('Authorization', `Bearer ${mockUser1.token}`)
        .attach('profile-pic', 'tests/fixtures/avatar-pic.png')
        .expect(200)

    const user = await User.findOne(mockUser1._id)
    expect(user.avatar).not.toBeNull()
})