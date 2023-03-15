
const {addSpamNumber,check_duplicate_spam_entry}=require('../Dao/spamDao');

const add_spam_number=async (req,res)=>{



    try{
        const user_id=req.user;
        const spam_number=req.body.spam_number;
        //check if user already marked the number as spam
        const spamExists=await check_duplicate_spam_entry(user_id,spam_number);
        //if no entry is found
        if(spamExists===false)
            await addSpamNumber(user_id,spam_number);
        else
            return res.send("Spam number already saved");
    }
    catch(err){
        return res.send("Error while adding a number as a spam");
    }

    res.send("Saved spam number successfully");

   
}

module.exports={
    add_spam_number
}