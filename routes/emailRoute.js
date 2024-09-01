const express = require('express') 
const  emailController = require('../controllers/emailController') 


const router = express.Router();



router.get('/verify/:token', emailController.verifyEmail);


module.exports = router;