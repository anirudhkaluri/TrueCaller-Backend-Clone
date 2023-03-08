
const {addSpamNumber}=require('../Dao/spamDao');

const add_spam_number=async (req,res)=>{
    const cookieExists = req.cookies.userid !== undefined;
    if(!cookieExists)
        return res.send("Please login first");

    const user_id=req.cookies.userid;
    const spam_number=req.body.spam_number;
    await addSpamNumber(user_id,spam_number);
    res.send("Saved spam number successfully");
}

module.exports={
    add_spam_number
}