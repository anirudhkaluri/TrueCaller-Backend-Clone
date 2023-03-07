
const {userExists,getRegisteredUsersCount}=require('../Dao/userDao');
const {getAllEntries}=require('../Dao/contactsDao');
const {getSpamHits}=require('../Dao/spamDao');

const search_with_name=(req,res)=>{
    const search_term=req.params.name;

}

const search_with_number=async (req,res)=>{
    //TODO: check if the cookie is set in request object (LOGIN CHECK)
    const search_number=req.params.phone;
    const user=await userExists(search_number);
    let users;
    let response_data;
    const total_registered_users=await getRegisteredUsersCount();
    if(user=== null){
        users=await getAllEntries(search_number);
        for(let i=0;i<users.length;i++){
            var spam_data=await getSpamHits(users[i].phone);
            const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
            users[i]["spam_liklihood"]=spam_liklihood;
        }
        response_data=users;
    }
    else{
        delete user.email;
        const spam_data=await getSpamHits(user.phone);
        const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
        response_data={"name":user.name,"phone":user.phone,"email":user.email,"spam_liklihood":spam_liklihood};
    }
    res.send(response_data);
}

const spam_liklihood_calculator=(spam_hits,spam_table_length,registered_users_count)=>{

    var weight1=(spam_hits/spam_table_length)*100;
    var weight2=(spam_hits/registered_users_count)*100;
    
    return (weight1+weight2);
}

module.exports={
    search_with_name,
    search_with_number,
    spam_liklihood_calculator
}