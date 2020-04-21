const chalk = require('chalk')
const express = require('express')
const router = new express.Router()

const userService = require('./../service/userService')
const auth = require('./../routers/middleware/auth')
const upload = require('./../routers/middleware/upload')

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

// File Upload User
router.post('/user/me/avatar', auth, upload.single('myFile'), (req, res) => {

    userService.saveAvatar(req, res)
    
},(error, req, res, next) => {
    res.status(400).send({
        success: false,
        error
    })
})

// File Get 
router.get('/user/:id/avatar', auth, async (req, res) => {

    try {
        const user = await req.user
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        console.log(chalk.red('Could not find avatar for user ' + req.params.id))
        res.status(404).send()
    }
   
})

module.exports = router