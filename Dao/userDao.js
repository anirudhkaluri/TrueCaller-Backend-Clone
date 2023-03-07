const User=require('../models');

const userExists=async (phone)=>{
    try{    
        const user=await User.findOne({where:{phone:phone}});
    }
    catch(error){
        console.log('error while checking if phone number already exists');
        throw(err);
    }

}