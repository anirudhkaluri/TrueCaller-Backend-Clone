const PersonalContact=require('../models');

const isInContacts=(userid,phone_number)=>{
    const user=PersonalContact.findOne({where:{user_id:userid,phone:phone_Number}});
    if(user)
        return true;
    return false;
}

const getAllEntries=async (phone_number)=>{
    const users=await PersonalContact.findAll({
        where:{phone:phone_number},
        attributes:['user_id','name','phone','-email']
    });
    return users;
}

module.exports={
    isInContacts,
    getAllEntries
}