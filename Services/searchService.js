
const {userExists,getRegisteredUsersCount,search_name_in_users}=require('../Dao/userDao');
const {search_phone_in_contacts,search_name_in_contacts}=require('../Dao/contactsDao');
const {getSpamHits}=require('../Dao/spamDao');

const search_with_name=async (req,res)=>{
    const cookieExists = req.cookies.userid !== undefined;
    if(!cookieExists)
        return res.send("Please login first");

    const search_term=req.params.name;
    const user_table_entries=await search_name_in_users(search_term); //exclude email, include user_id
    const contact_table_entries=await search_name_in_contacts(search_term); //exclude email, userid,
    const all_entries=[...user_table_entries,...contact_table_entries];
    const total_registered_users=await getRegisteredUsersCount();
    var users_array=[];
    //calculate spam liklihood
    for(let i=0;i<all_entries.length;i++){
        var spam_data=await getSpamHits(all_entries[i].phone);
        const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
        const user_object={"name":all_entries[i].name,"phone":all_entries[i].phone,"spam_liklihood":spam_liklihood};
        users_array[i]=user_object;
    }
    //sort such that those entries whose name starts with a prefix comes first
    users_array.sort((a,b)=>{
        if(a.name.startsWith(`${search_term}`) && !b.name.startsWith(`${search_term}`))
            return -1;
        else if (a.name.startsWith(`${search_term}`) && !b.name.startsWith(`${search_term}`))
            return 1;
        return 0;
    });
    res.json(users_array);
}

const search_with_number=async (req,res)=>{

    const cookieExists = req.cookies.userid !== undefined;
    if(!cookieExists)
        return res.send("Please login first");


    const search_number=req.params.phone;
    const user=await userExists(search_number);
    let users;
    let response_data;
    const total_registered_users=await getRegisteredUsersCount();
    if(user=== null){
        users=await search_phone_in_contacts(search_number);
        var users_array=[];
        for(let i=0;i<users.length;i++){
            var spam_data=await getSpamHits(users[i].phone);
            const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
            const user_object={"name":users[i].name,"phone":users[i].phone,"spam_liklihood":spam_liklihood};
            users_array[i]=user_object;
        }
        response_data=users_array;
    }
    else{
        const spam_data=await getSpamHits(user.phone);
        const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
        response_data={"user_id":user.user_id,"name":user.name,"phone":user.phone,"spam_liklihood":spam_liklihood};
    }
    res.send(response_data);
}

const spam_liklihood_calculator=(spam_hits,spam_table_length,registered_users_count)=>{

    var weight1=(spam_hits/spam_table_length)*100;
    var weight2=(spam_hits/registered_users_count)*100;
    return (weight1+weight2);
}

module.exports= { 
    search_with_name,
    search_with_number,
    spam_liklihood_calculator
}