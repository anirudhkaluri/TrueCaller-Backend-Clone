const {PersonalContact}=require('../models');

const isInContacts=async (userid,phone_number)=>{
    const user=await PersonalContact.findOne({where:{user_id:userid,phone:phone_number}});
    if(user)
        return true;
    return false;
}

const getAllEntries=async (phone_number)=>{
    const users=await PersonalContact.findAll({
        where:{phone:phone_number},
    });
    return users;
}

module.exports={
    isInContacts,
    getAllEntries
}