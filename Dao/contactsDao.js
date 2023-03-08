const {PersonalContact}=require('../models');
const {Op}=require('sequelize');

//check if phone_number is in personal contacts of user with user_id
const isInContacts=async (userid,phone_number)=>{
    
    const user=await PersonalContact.findOne({where:{user_id:userid,phone:phone_number}});
    if(user)
        return true;
    
  
    return false;
    
}

//search a given phone_number in PersonalContacts table
const search_phone_in_contacts=async (phone_number)=>{
   
        const users=await PersonalContact.findAll({
            where:{phone:phone_number},
        });
  
    return users;
}


//search a given name or search_term in PersonalContacts table
const search_name_in_contacts=async(search_term)=>{
    
        const contact_table_entries=await PersonalContact.findAll({
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
   
    return contact_table_entries;
}

module.exports={
    isInContacts,
    search_phone_in_contacts,
    search_name_in_contacts
}