const express=require('express');
const router=express.Router();
const {generateAccessToken,authenticateToken}=require('../Services/authFunctions');

const spam_controller=require('../Services/spamService');

//Routing to add a spam number
//Insert try-catch here

router.post('/addNumber',authenticateToken,spam_controller.add_spam_number);

router.use((req, res, next) => {
    res.status(404).send("Sorry, we can't find that resource!");
  });


module.exports=router;