const request = require('supertest')
const mongoose = require('mongoose')

const User = require('../src/model/user')
const AuthToken = require('../src/model/authtoken')

const app = require('../src/app')
const authService = require('../src/service/authService')

const testUser1 = {
    username : 'Test User 1',
    email : 'test.user1@test.com',
    password : 'Test#123'
}

const testUser2 = {
    username : 'Test User 2',
    email : 'test.user2@test.com',
    password : 'Test#123'
}

beforeEach(async () => {
    
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await User.deleteMany()
    await AuthToken.deleteMany()
    const savedUser1 = await new User(testUser1).save()
    const savedUser2 = await new User(testUser2).save()

    const token = await authService.generateToken(savedUser1)

    await new AuthToken({
        userId : savedUser1._id,
        token: token
    }).save()

    testUser1.token = token
})

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
  })

// Login 
test('User: Should login user', async () => {
    await request(app).post('/user/login').send({
        email : testUser1.email,
        password : testUser1.password
    }).expect(200)
})

test('User: Should not login user with invalid email', async () => {
    await request(app).post('/user/login').send({
        email : "fakeemail@test.com",
        password : testUser1.password
    }).expect(400)
})

test('User: Should not login user with invalid password', async () => {
    await request(app).post('/user/login').send({
        email : testUser1.email,
        password : "Invalid#123"
    }).expect(400)
})

// Profile 
test('User: Should NOT get user profile', async (done) => {
    await request(app).get('/user/me')
        .set('Authorization', `Bearer invalid.jwt.eyJhbGciOiJIUzI1NiIsInR5cC`)
        .send()
        .expect(401)
        done()
})

test('User: Should get user profile', async () => {
    await request(app).get('/user/me')
        .set('Authorization', `Bearer ${testUser1.token}`) // const token = req.header('Authorization').replace('Bearer ', '')
        .send()
        .expect(200)
})

// List 
test('User: Should list all users', async () => {
    await request(app).get('/users').send().expect(200)
})


// Create
test('User: Should create new user', async () =>{
    await request(app).post('/user').send({
        "username" : "Jane Doe",
        "email": "jane.doe@test.com",
        "password" : "Test#123"
    }).expect(201)
})



