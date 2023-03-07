const User=require('../models');

const userExists=async (phone)=>{
    try{    
        const user=await User.findOne({where:{phone:phone}});
      
    }
    catch(error){
        console.log('error while checking if phone number already exists');
        throw error;
    }
    if(user)
        return true;
    return false;
}

const add_new_user=(user){
    try{
        User.create(user);
    }
    catch(error){
        throw error;
    }
}