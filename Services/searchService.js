
const {userExists}=require('../Dao/userDao');
const {getAllEntries}=require('../Dao/contactsDao');

const search_with_name=(req,res)=>{
    const search_term=req.params.name;

}

const search_with_number=async (req,res)=>{
    const search_number=req.params.phone;
    const users=await userExists(search_number);
    let response_json;
    if(users!== null){
       
    }
    else{
        users=getAllEntries(search_number);
    }
}

module.exports={
    search_with_name,
    search_with_number
}