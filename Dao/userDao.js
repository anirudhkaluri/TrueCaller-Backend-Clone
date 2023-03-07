const {User,Credential}=require('../models');

const {Sequelize}=require('sequelize');
const sequelize=new Sequelize('global_database','root','root',{dialect:'sqlite',storage:'../global_database.sqlite'});

const userExists=async (phoneNumber)=>{
    try{    
        const user=await User.findOne({where:{phone:phoneNumber}}); 
        if(user)
            return true;     
    }
    catch(error){
        console.log('error while checking if phone number already exists');
        throw error;
    }
    
    return false;
}



const add_new_user=async (new_user_details)=>{
   

    try{
        // await sequelize.transaction(async(t)=>{

        //     const user_model_instance=await User.create({
        //         name:new_user_details.name,
        //         phone:new_user_details.phone,
        //         email:new_user_details.email
        //     },{transaction:t});

        //     console.log("NEW MODEL INSTANCE CREATED IS:",user_model_instance);

        //     const credential_model_instance=await Credential.create({
        //         user_id:user_model_instance.user_id,
        //         password:new_user_details.password
        //     },{transaction:t});
        // });

        const user_model_instance=await User.create({
            name:new_user_details.name,
            phone:new_user_details.phone,
            email:new_user_details.email
        });

        const credential_model_instance=await Credential.create({
            user_id:user_model_instance.user_id,
            password:new_user_details.password
        });
        
    }
    catch(error){
        console.log('error creating new user',error);
        throw error;
    }
}

module.exports={
    userExists,
    add_new_user
}