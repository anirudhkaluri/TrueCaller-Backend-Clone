const express=require('express');
const router=express.Router();

const spam_controller=require('../Services/spamService');

//Routing to add a spam number

router.post('/spamService/addNumber',spam_controller.add_spam_number);


module.exports=router;