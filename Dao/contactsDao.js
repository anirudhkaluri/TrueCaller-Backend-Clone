const PersonalContact=require('../models');

const isInContacts=(userid,phone_number)=>{
    const user=PersonalContact.findOne({where:{user_id:userid,phone:phone_Number}});
    if(user)
        return true;
    return false;
}

module.exports={
    isInContacts
}