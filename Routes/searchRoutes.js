const express=require('express');
const router=express.Router();
const {authenticateToken}=require('../Services/authFunctions');

//import Services 


const search_controller=require('../Services/searchService');


//Routing to search with a name

router.get('/searchName/:name',authenticateToken,search_controller.search_with_name);

//Routing to search with a phone number

router.get('/searchPhone/:phone',authenticateToken,search_controller.search_with_number);

router.use((req, res, next) => {
    res.status(404).send("Sorry, we can't find that resource!");
  });

  
module.exports=router;