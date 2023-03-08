const express=require('express');
const router=express.Router();

const spam_controller=require('../Services/spamService');

//Routing to add a spam number

router.post('/addNumber',spam_controller.add_spam_number);

router.use((req, res, next) => {
    res.status(404).send("Sorry, we can't find that resource!");
  });

module.exports=router;