
const {userExists,add_new_user,getPhone,getUser}=require('../Dao/userDao');
const {isInContacts}=require('../Dao/contactsDao');
const {bcrypt}=require('bcrypt');



//REGISTERING A USER

const register_user= (req,res)=>{

    const user_details=req.body;
    console.log("THE USER DETAILS ARE AS FOLLOWS",user_details);
    var response_text="";
    const user_present = userExists(user_details.phone);
    if(!user_present.status){ 
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
            res.cookie('userid',user_present.user_id,{
                httpOnly:true,
                sameSite:'None',
                secure:true,
                maxAge:60000000
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

//RETRIEVING A USER

const get_user=(req,res)=>{
    const userid_person_searched=req.params.user_id;
    const userid_person_searching=req.cookies.userid;

    const phone_person_searching=getPhone(userid_person_searching); //TO DO IN DAO
    const is_user_in_contacts= isInContacts(person_searched_userid,person_searching_phone); //TO DO IN DAO
    const user_being_searched=getUser(userid_person_searched); //TO DO IN DAO
    if(is_user_in_contacts===false)
        delete user_being_searched.email;

    const  json_response=user_being_searched;       
    res.JSON(json_response);

}


//LOGGING IN A USER


const login_user=(req,res)=>{
    const user_entered_credentials=req.body;
    const user_entered_password=user_entered_credentials.password;
    const user_phone=user_entered_credentials.phone;
    const user_present=userExists(user_phone);
    var response_text="";
    if(user_present.status){
        const hashed_password=getSavedPassword(user_present.user_id);
        bcrypt.compare(user_entered_password,hashed_password,(err,result)=>{
            if(err){
                console.log('error while comparing passwords',err);
                response_text="Internal error";
            }
            else if(result===true){
                response_text="You have successfully logged in";
                res.cookie('userid',user_present.user_id,{
                    httpOnly:true,
                    sameSite:'None',
                    secure:true,
                    maxAge:60000000
                });
            }
            else
                response_text="You have entered incorrect password";
        });
    }
    else
        response_text="Please register before you can login";
    res.send(response_text);

}

module.exports={
    register_user,
    get_user,
    login_user
}