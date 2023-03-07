const {User}=require('../models');


const register_user=(req,res)=>{

    const user_details=req.body;
    var response_text="";
    if(!userExists(user_details.phone)){ //TO DO IN DAO
        var mail=null;
        if(user_details.hasOwnProperty('email') && user_details.email!==null)
            mail=user_details.email;
        try{    
            add_new_user({ //TO DO IN DAO
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