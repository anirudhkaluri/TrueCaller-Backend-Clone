const {User,Credential}=require('../models');
const {Op}=require('sequelize');

const {Sequelize}=require('sequelize');
const sequelize=new Sequelize('global_database','root','root',{
    dialect:'sqlite',
    storage:'../global_database.sqlite',
});

const userExists=async (phoneNumber)=>{
    try{    
        const user=await User.findOne({where:{phone:phoneNumber}}); 

        return user;          
    }
    catch(error){
        console.log('error while checking if phone number already exists');
        throw error;
    }
    return null;
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

const getRegisteredUsersCount=async ()=>{

    const count=await User.count();
    return count;

}

const search_name_in_users=async(search_term)=>{

    const user_table_entries=await User.findAll({
        where:{
            name:{
                [Op.like]:`%${search_term}%`
            }
        },
        attributes:{
            exclude:['user_id','email','createdAt','updatedAt']
        }
    });
    return user_table_entries;
}


module.exports={
    userExists,
    add_new_user,
    getPhone,
    getUser,
    getRegisteredUsersCount,
    search_name_in_users
}