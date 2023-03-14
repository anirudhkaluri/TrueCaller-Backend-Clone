
const {addSpamNumber}=require('../Dao/spamDao');

const add_spam_number=async (req,res)=>{

    //Check if User logged In 
    // const cookieExists = req.cookies.userid !== undefined;
    // if(!cookieExists)
    //     return res.send("Please login first");
    
     //TO-DO : IF USER ALREADY MARKED A NUMBER AS SPAM, SHOULDNT ALLOW THEM TO DUPLICATE
    try{
        const user_id=req.user;
        console.log("userid isssssssssssssssssssssssssssssssss",user_id);
        const spam_number=req.body.spam_number;
        await addSpamNumber(user_id,spam_number);
    }
    catch(err){
        console.log(err);
    }

    res.send("Saved spam number successfully");

   
}

module.exports={
    add_spam_number
}