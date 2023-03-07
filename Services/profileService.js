
const {userExists,add_new_user,getPhone,getUser,getRegisteredUsersCount}=require('../Dao/userDao');
const {isInContacts}=require('../Dao/contactsDao');
const {getSavedPassword}=require('../Dao/credentialDao');
const {spam_liklihood_calculator}=require('./searchService');
const {getSpamHits}=require('../Dao/spamDao');

const bcrypt=require('bcrypt');



//REGISTERING A USER

const register_user=async (req,res)=>{

    const user_details=req.body;
    
    var response_text="";
    const user = await userExists(user_details.phone);
    if(user===null){ 
        var mail=null;
        if(user_details.hasOwnProperty('email') && user_details.email!==null)
            mail=user_details.email;
        try{    
            const created_user=await add_new_user({ 
                name:user_details.name,
                phone:user_details.phone,
                email:mail,
                password:user_details.password
            });
            res.cookie('userid',created_user.user_id,{
                httpOnly:true,
                sameSite:'None',
                secure:false,
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

const get_user=async (req,res)=>{
    const userid_of_person_searched=req.params.user_id;
    const userid_of_person_searching=req.cookies.userid;
    console.log("THE COOKIE IS======",req.cookies.userid);
    let json_response;
    const phone_of_person_searching=await getPhone(userid_of_person_searching); 
    const is_user_in_contacts= await isInContacts(userid_of_person_searched,phone_of_person_searching); 
    const user_being_searched=await getUser(userid_of_person_searched); 

    const spam_data=await getSpamHits(user_being_searched.phone);
    const total_registered_users=await getRegisteredUsersCount();
    const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);

    if(is_user_in_contacts===false)
        json_response={"name":user_being_searched.name,"phone":user_being_searched.phone,"spam_liklihood":spam_liklihood};
    else
        json_response={"name":user_being_searched.name,"phone":user_being_searched.phone,"email":user_being_searched.email,"spam_liklihood":spam_liklihood};       
    res.json(json_response);

}


//LOGGING IN A USER


const login_user=async (req,res)=>{
 
    const user_entered_credentials=req.body;
    const user_entered_password=user_entered_credentials.password;
    const user_phone=user_entered_credentials.phone;
    const user=await userExists(user_phone);
    var response_text="";
    if(user!==null){
        const hashed_password=await getSavedPassword(user.user_id);

        bcrypt.compare(user_entered_password,hashed_password,(err,result)=>{
            if(err){
                console.log('error while comparing passwords',err);
                response_text="Internal error";
            }
            else if(result===true){
                response_text="You have successfully logged in";
                res.cookie('userid',cook_val,{
                    httpOnly:true,
                    sameSite:'None',
                    secure:false,
                    maxAge:60000000
                });  
            }
            else{
                response_text="You have entered incorrect password";
            }       
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