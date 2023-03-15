
const express=require('express');
const router=express.Router();

const profile_controller=require('../Services/profileService');

//Routing for  User registration 
router.post('/registerUser',profile_controller.register_user);

//Login route
router.post('/loginUser',profile_controller.login_user);


//Routing to get all details including mail-id when clicked on a search result
router.post('/getUserDetails/',profile_controller.get_user_along_with_email);

router.use((req, res, next) => {
    res.status(404).send("Sorry, we can't find that resource!");
});

module.exports=router;