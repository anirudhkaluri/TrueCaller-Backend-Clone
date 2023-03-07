const {User}=require('../models');
const {userExists,add_new_user}=require('../Dao/userDao');

const register_user= (req,res)=>{

    const user_details=req.body;
    console.log("THE USER DETAILS ARE AS FOLLOWS",user_details);
    var response_text="";
    const phone_exists = userExists(user_details.phone);
    if(phone_exists){ 
        console.log("PHONE NUMBER DOESNT EXIST");
        var mail=null;
        if(user_details.hasOwnProperty('email') && user_details.email!==null)
            mail=user_details.email;
        try{    
            add_new_user({ 
                name:user_details.name,
                phone:user_details.phone,
                email:mail,
                password:user_details.password
            });
            response_text="user added successfully";
        }
        catch(error){
            console.log('Error occured while registering new user',err);
            response_text="failed to save user details";
        }
    }
    else
        response_text="phone number already present";
    res.send(response_text);

}

const get_user=(req,res)=>{

}

module.exports={
    register_user,
    get_user
}