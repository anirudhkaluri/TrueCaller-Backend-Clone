
const {userExists,add_new_user,getPhone}=require('../Dao/userDao');
const {isInContacts}=require('../Dao/contactsDao');
const {getSavedPassword}=require('../Dao/credentialDao');
const {spam_liklihood_calculator}=require('./searchService');
const {getSpamHits}=require('../Dao/spamDao');

const {generateAccessToken,authenticateToken}=require('./authFunctions');

const bcrypt=require('bcrypt');



//REGISTERING A USER

const register_user=async (req,res)=>{

    //req.body has new user details
    const user_details=req.body; 

    //check if user already registered
    const user = await userExists(user_details.phone);

    //if user not registered
    if(user===null){ 

        try{

            //add_new_user dao called to register a user
            const created_user=await add_new_user({ 
                name:user_details.name,
                phone:user_details.phone,
                email:user_details.email,
                password:user_details.password
           });

            //registration logs in automatically=> create JWT
            const accessToken=generateAccessToken({userid:created_user.user_id});
            return res.json(accessToken);
        }

        catch(error){
            console.log("Error while registering new user:",error);
            return res.send("Error while registering new user");
        }    
    }

    res.send("Phone number already exists.");
  
}





//USER LOGIN
const login_user=async (req,res)=>{

        
    //retrieve posted data
    const user_entered_credentials=req.body;
    const user_entered_password=user_entered_credentials.password;
    const user_phone=user_entered_credentials.phone;

    try{

        //check if user with that phone number exists
        const user=await userExists(user_phone);

        //if user exists see if the password is matching
        if(user!==null){

            //retrieve the hashed password
            const hashed_password=await getSavedPassword(user.user_id);

            //compare with user entered password
            const result=bcrypt.compareSync(user_entered_password,hashed_password);

            //if corect password is entered generate the token
            if(result){

                //generate token
                const accessToken=generateAccessToken({userid:user.user_id});
                
                //send the token
                return res.json(accessToken);
            }
            else
                return res.send("Please enter the correct password");
        }
        
    }
    catch(err){
        console.log(err);
        return res.send("Error logging in");
    }
    res.send("Please register first");   
}



//GET USER DETAILS ALONG WITH EMAIL IF POSSIBLE (SEARCH FUNCTIONALITY EXTENSION)
const get_user_along_with_email=async (req,res)=>{
   

    //check if user is logged in
    const cookieExists = req.cookies.userid !== undefined;
    if(!cookieExists)
        return res.send("Please login first");

    let json_response=null;

    try{
        //req.body consists of Search Result which the person clicked on
        const user_search_result=req.body;

        //userid of the person searching is stored in the cookie. The same cookie we use to verify if logged in or logged out
        const userid_of_person_searching=req.cookies.userid;

    

        //retreive searched user
        const searchedUser=await userExists(user_search_result.phone);
        const phone_of_person_searching=await getPhone(userid_of_person_searching); 
        
        //if searched user is registered
        if(searchedUser){
            const is_user_in_contacts= await isInContacts(searchedUser.user_id,phone_of_person_searching);

            //if the person is present in searched users contact list
            if(is_user_in_contacts===true)
                json_response={"name":searchedUser.name,"phone":searchedUser.phone,"spam_liklihood":user_search_result.spam_liklihood,"email":searchedUser.email};
            else
                json_response={"name":searchedUser.name,"phone":searchedUser.phone,"spam_liklihood":user_search_result.spam_liklihood};
        }
        else
            json_response={"name":searchedUser.name,"phone":searchedUser.phone,"spam_liklihood":user_search_result.spam_liklihood};
    }
    catch(err){
        console.log(err);
    }
    res.json(json_response);

}


module.exports={
    register_user,
    get_user_along_with_email,
    login_user,
}