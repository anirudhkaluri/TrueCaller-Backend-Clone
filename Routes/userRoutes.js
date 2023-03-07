
const express=require('express');
const router=express.Router();

const profile_controller=require('../Services/profileService');

//Routing for  User registration 

router.post('/profileService/registerUser',profile_controller.register_user);

//Routing to get all details including mail-id when clicked on a search result

router.get('/profileService/getUser/:user_id',profile_controller.get_user);


module.exports=router;