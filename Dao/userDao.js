const {User,Credential}=require('../models');
const {Op}=require('sequelize');

const {Sequelize}=require('sequelize');
const sequelize=new Sequelize('global_database','root','root',{
    dialect:'sqlite',
    storage:'../global_database.sqlite',
});



//return user if a user registered already or return null
const userExists=async (phoneNumber)=>{
  
        const user=await User.findOne({where:{phone:phoneNumber}}); 

        return user;          
  
    //if it user doesnt exist return null
    return null;
}


//FOR REGISTERING NEW USERS
const add_new_user=async (new_user_details)=>{
   

        const sequelize=User.sequelize;

        //wrap the Daos in a transacton
        const t=await sequelize.transaction();
        
       
        try{

            //insert name, phone and email into Users table
            const user_model_instance=await User.create({
                name:new_user_details.name,
                phone:new_user_details.phone,
                email:new_user_details.email
            },{transaction:t});

            //insert user_id and password into credential table
            //we get the autogenerated user_id from the above step
            const credential_model_instance=await Credential.create({
                user_id:user_model_instance.user_id,
                password:new_user_details.password
            },{transaction:t});

            await t.commit();
            return user_model_instance;
        }
        catch(err){
            await t.rollback();
        }
        //return user created
        
        
}

//given a user_id return the phon number from the Users table
const getPhone=async (user_id)=>{
    const user=await User.findByPk(user_id);
    return user.phone;
}

//return the number of registered user (for spam_liklihood calculation)
const getRegisteredUsersCount=async ()=>{

    const count=await User.count();
    return count;

}

//given a term search for it among the names in the user table
//similar to LIKE in sql
const search_name_in_users=async(search_term)=>{

    const user_table_entries=await User.findAll({
        where:{
            name:{
                [Op.like]:`%${search_term}%`
            }
        },
        //we dont need to show these attributes in the search result
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
    getRegisteredUsersCount,
    search_name_in_users
}