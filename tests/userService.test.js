const request = require('supertest')
const app = require('../src/app')

test('User: Should create new user', async () =>{

    await request(app).post('/user').send({
        "username" : "test user",
        "email": "test@test.com",
        "password" : "Test#123"
    }).expect(201)

})



