const SpamNumber=require('../models');

const getSpamHits=async (phone_number)=>{
    
    const entries=await SpamNumber.findAll({where:{phone:phone_number}});
    const count=await SpamNumber.count();
    
    return  {spam_hits:entries.length,spam_table_length:count};

}

module.exports={
    getSpamHits
}