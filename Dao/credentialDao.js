const {Credential}=require('../models');

//TODO INSERT TRY CATCH STATEMENTS
//returns saved password for login authentication
const getSavedPassword=async (userid)=>{
    const credential_entry=await Credential.findOne({where:{user_id:userid}});
    return credential_entry.password;
}
module.exports={
    getSavedPassword
}