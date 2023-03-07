const {User,Credential}=require('../models');

const {Sequelize}=require('sequelize');
const sequelize=new Sequelize('global_database','root','root',{
    dialect:'sqlite',
    storage:'../global_database.sqlite',
});

const userExists=async (phoneNumber)=>{
    try{    
        const user=await User.findOne({where:{phone:phoneNumber}}); 
        if(user){
            console.log("THE USER IS "+user);
            console.log("THE USER ID IS"+user.user_id);
            return {status:true,user_id:user.user_id};  
        }
              
    }
    catch(error){
        console.log('error while checking if phone number already exists');
        throw error;
    }
    return {status:false};
}



const add_new_user=async (new_user_details)=>{
   

        //TO DO CONVERT IT INTO A TRANSACTION
     
        const user_model_instance=await User.create({
            name:new_user_details.name,
            phone:new_user_details.phone,
            email:new_user_details.email
        });

        const credential_model_instance=await Credential.create({
            user_id:user_model_instance.user_id,
            password:new_user_details.password
        });
        return user_model_instance;
        
}

const getPhone=async (user_id)=>{
    const user=await User.findByPk(user_id);
    return user.phone;
}

const getUser=async (user_id)=>{

    const user=await User.findByPk(user_id);
    return user;

}


module.exports={
    userExists,
    add_new_user,
    getPhone,
    getUser
}