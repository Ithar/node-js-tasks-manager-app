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

// Login User
router.post('/user/login', (req, res) => {
    userService.loginUser(req, res);
})

// Logout User
router.put('/user/logout', (req, res) => {
    userService.logoutUser(req, res);
})

// Authenticated User Endpoints

// Gets User Me
router.get('/user/me', auth, (req, res) => {
    res.send(req.user)
})

// Gets User
router.get('/user', auth, (req, res) => {
    res.send(req.user)
})

// Delete User
router.delete('/user', auth, (req, res) => {
    userService.deleteUser(req, res);
})

// Update User
router.patch('/user', auth, (req, res) => {
    userService.updateUser(req, res);
})

module.exports = router