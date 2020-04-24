const request = require('supertest')
const mongoose = require('mongoose')

const User = require('../src/model/user')
const AuthToken = require('../src/model/authtoken')

const app = require('../src/app')
const authService = require('../src/service/authService')

const testUser1 = {
    username: 'Test User 1',
    email: 'test.user1@test.com',
    password: 'Test#123'
}

const testUser2 = {
    username: 'Test User 2',
    email: 'test.user2@test.com',
    password: 'Test#123'
}

beforeEach(async () => {

    jest.spyOn(console, 'info').mockImplementation(() => { });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });

    await User.deleteMany()
    await AuthToken.deleteMany()
    const savedUser1 = await new User(testUser1).save()
    const savedUser2 = await new User(testUser2).save()

    const token = await authService.generateToken(savedUser1)
    const token2 = await authService.generateToken(savedUser2)

    await new AuthToken({
        userId: savedUser1._id,
        token: token
    }).save()

    await new AuthToken({
        userId: savedUser2._id,
        token: token2
    }).save()

    testUser1.token = token
    testUser2.token = token2
})

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})

// Login 
test('User: Should login user', async () => {
    await request(app).post('/user/login')
        .send({
            email: testUser1.email,
            password: testUser1.password
        }).expect(200)
})

test('User: Should not login user with invalid email', async () => {
    await request(app).post('/user/login')
        .send({
            email: "fakeemail@test.com",
            password: testUser1.password
        }).expect(400)
})

test('User: Should not login user with invalid password', async () => {
    await request(app).post('/user/login')
        .send({
            email: testUser1.email,
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
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send()
        .expect(200)

    // expect(response.body).toMatchObject({
    //     user: {
    //         username : testUser1.username,
    //         email: testUser1.email
    //     },
    //     token : testUser1.token
    // })    
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

// Delete 
test('User: Should NOT delete user', async () => {
    await request(app).delete('/user')
        .send()
        .expect(401)
})

test('User: Should delete user', async () => {
    await request(app).delete('/user')
        .set('Authorization', `Bearer ${testUser2.token}`)
        .send()
        .expect(200)

    const user = await User.findById(testUser2._id)
    expect(user).toBeNull()
})

// Avatar 
test('User: Should upload image', async () => {
    await request(app).post('/user/me/avatar')
    .set('Authorization', `Bearer ${testUser1.token}`)
    .attach('profile-pic', 'tests/fixtures/avatar-pic.png')
    .expect(200)

    const user = await User.findOne(testUser1._id)
    expect(user.avatar).not.toBeNull()
})