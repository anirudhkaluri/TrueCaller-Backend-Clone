
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

const get_user_along_with_email=async (req,res)=>{
    const cookieExists = req.cookies.userid !== undefined;
    if(!cookieExists)
        return res.send("Please login first");

    const user_search_result=req.body;
    const userid_of_person_searching=req.cookies.userid;
    let json_response;

    const searchedUser=await userExists(user_search_result.phone);
    const phone_of_person_searching=await getPhone(userid_of_person_searching); 
    
  
    if(searchedUser){
        const is_user_in_contacts= await isInContacts(searchedUser.user_id,phone_of_person_searching);
        if(is_user_in_contacts===true)
            json_response={"name":searchedUser.name,"phone":searchedUser.phone,"spam_liklihood":user_search_result.spam_liklihood,"email":searchedUser.email};
    }
    else
    json_response={"name":searchedUser.name,"phone":searchedUser.phone,"spam_liklihood":user_search_result.spam_liklihood};
      
    res.json(json_response);

}


//LOGGING IN A USER


const login_user=async (req,res)=>{
 
    const user_entered_credentials=req.body;
    const user_entered_password=user_entered_credentials.password;
    const user_phone=user_entered_credentials.phone;
    const user=await userExists(user_phone);
    res.clearCookie('userid');
    var res_text="";
    if(user!==null){
        const hashed_password=await getSavedPassword(user.user_id);
        const result=bcrypt.compareSync(user_entered_password,hashed_password);
        if(result){
            res_text="You have successfully logged in";
            res.cookie('userid',user.user_id,{
                httpOnly:true,
                sameSite:'None',
                secure:false,
                maxAge:60000000
            });  
        }
        else
             res_text="You have entered incorrect password";          
    }
    else
        res_text="Please register before you can login";
    res.send(res_text);
}

//logout user
const logout_user=(req,res)=>{
    res.clearCookie('userid');
    res.send("Please login to continue");
}

module.exports={
    register_user,
    get_user_along_with_email,
    login_user,
    logout_user
}