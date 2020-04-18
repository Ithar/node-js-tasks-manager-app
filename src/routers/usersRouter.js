const express = require('express')
const userService = require('./../service/userService')
const router = new express.Router()

// Users 
router.get('/users', (req, res) => {
    userService.listUsers(res);
})
router.post('/user', (req, res) => {
    userService.saveUser(req, res);
})
router.get('/user/:id', (req, res) => {
    userService.findUser(req, res);
})
router.delete('/user:id', (req, res) => {
    userService.delete(res);
})
router.patch('/user/:id', (req, res) => {
    userService.updateUser(req, res);
})
router.post('/user/login', (req, res) => {
    userService.loginUser(req, res);
})

module.exports = router