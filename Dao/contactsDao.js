const {PersonalContact}=require('../models');
const {Op}=require('sequelize');

const isInContacts=async (userid,phone_number)=>{
    const user=await PersonalContact.findOne({where:{user_id:userid,phone:phone_number}});
    if(user)
        return true;
    return false;
}

const search_phone_in_contacts=async (phone_number)=>{
    const users=await PersonalContact.findAll({
        where:{phone:phone_number},
    });
    return users;
}

const search_name_in_contacts=async(search_term)=>{
    const contact_table_entries=await PersonalContact.findAll({
        where:{
            name:{
                [Op.like]:`%${search_term}%`
            }
        },
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