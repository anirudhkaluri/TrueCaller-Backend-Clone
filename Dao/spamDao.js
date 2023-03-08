const {SpamNumber}=require('../models');

//TO DO INSERT TRY CATCH STATEMENTS

//FOR spam_liklihood claculation
const getSpamHits=async (phone_number)=>{
    
    //first get number of times phone_number is marked spam
    const entries=await SpamNumber.findAll({where:{phone:phone_number}});

    //total number of entries in the spam table
    const count=await SpamNumber.count();
    
    //return an object with both the results
    return  {spam_hits:entries.length,spammers_count:count};

}

//Adding a spam number by a user
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