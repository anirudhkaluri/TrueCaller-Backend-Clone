const express=require('express');
const router=express.Router();

//import Services 


const search_controller=require('../Services/searchService');






//Routing to search with a name

router.get('/searchName/:name',search_controller.search_with_name);

//Routing to search with a phone number

router.get('/searchPhone/:phone')


module.exports=router;