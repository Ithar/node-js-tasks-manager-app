const express = require('express')
const router = new express.Router()

const userService = require('./../service/userService')
const auth = require('./../routers/middleware/auth')

//////////
// Users 

//////////

// List Users
router.get('/users', (req, res) => {
    userService.listUsers(res);
})

// Create User
router.post('/user', (req, res) => {
    userService.saveUser(req, res);
})

// Gets User Me
router.get('/user/me', auth, (req, res) => {
    res.send(req.user)
})

// Gets User
router.get('/user/:id', auth, (req, res) => {
    userService.findUser(req, res);
})

// Delete User
router.delete('/user:id', auth, (req, res) => {
    userService.delete(res);
})

// Update User
router.patch('/user/:id', auth, (req, res) => {
    userService.updateUser(req, res);
})

// Login User
router.post('/user/login', (req, res) => {
    userService.loginUser(req, res);
})

module.exports = router