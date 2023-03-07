const {SpamNumber}=require('../models');

const getSpamHits=async (phone_number)=>{
    
    const entries=await SpamNumber.findAll({where:{phone:phone_number}});
    const count=await SpamNumber.count();
    
    return  {spam_hits:entries.length,spammers_count:count};

}

const addSpamNumber=async (userid,phone_number)=>{
    const entry=await SpamNumber.create({
                    user_id:userid,
                    phone:phone_number
                });
}



module.exports={
    getSpamHits,
    addSpamNumber
}