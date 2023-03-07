const {User,Credential}=require('../models');


const userExists=async (phoneNumber)=>{
    try{    
        const user=await User.findOne({where:{phone:phoneNumber}});      
    }
    catch(error){
        console.log('error while checking if phone number already exists');
        throw error;
    }
    if(user)
        return true;
    return false;
}



const add_new_user=async (new_user_details)=>{
    const new_user_password=new_user_details.password;
    delete new_user_details.password;
    try{
        await sequelize.transaction(async(t)=>{
            const user_model_instance=await User.create(new_user_details,{transaction:t});
            const credential_model_instance=await Credential.create({user_id:user_model_instance.user_id,password:new_user_password});
        });
        
    }
    catch(error){
        console.log('error creating new user');
        throw error;
    }
}

module.exports={
    userExists,
    add_new_user
}