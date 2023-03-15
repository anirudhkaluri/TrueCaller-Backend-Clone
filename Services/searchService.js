
const {userExists,getRegisteredUsersCount,search_name_in_users}=require('../Dao/userDao');
const {search_phone_in_contacts,search_name_in_contacts}=require('../Dao/contactsDao');
const {getSpamHits}=require('../Dao/spamDao');

//SEARCH WITH A NAME
const search_with_name=async (req,res)=>{

 

    //the array which we will send
        var users_array=[];
    
    //Extract the Name/search-term
    const search_term=req.params.name;

    try{
        //get data from Users table
        const user_table_entries=await search_name_in_users(search_term); 

        //get data from PersonalContacts table
        const contact_table_entries=await search_name_in_contacts(search_term);

        //combine all the results
        const all_entries=[...user_table_entries,...contact_table_entries];

        //get number of users registered for calculating spam liklihood
        const total_registered_users=await getRegisteredUsersCount();

        

        //calculate spam liklihood and create populate array
        for(let i=0;i<all_entries.length;i++){

            //calculate spam liklihood for each result. Returns Number of times a number is marked spam, total number of spam entries
            var spam_data=await getSpamHits(all_entries[i].phone);
            const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
            const user_object={"name":all_entries[i].name,"phone":all_entries[i].phone,"spam_liklihood":spam_liklihood};

            //add the result into the response array
            users_array[i]=user_object;
        }

        //sort such that those entries whose name starts with a prefix comes first
        //define a comparator for custom sorting
        users_array.sort((a,b)=>{
            if(a.name.startsWith(`${search_term}`) && !b.name.startsWith(`${search_term}`))
                return -1;
            else if (a.name.startsWith(`${search_term}`) && !b.name.startsWith(`${search_term}`))
                return 1;
            return 0;
        });
    }
    catch(err){
        console.log(err);
    }

    res.json(users_array);
}


//SEARCH WITH NUMBER FUNCTIONALITY
const search_with_number=async (req,res)=>{

    //Allow only if logged in
    const cookieExists = req.cookies.userid !== undefined;
    if(!cookieExists)
        return res.send("Please login first");

    let response_data;
    try{
        //extract phone number from URL
        const search_number=req.params.phone;

        //search if a user with that phone number is registered
        const user=await userExists(search_number);
        let users;
        
        
        //get number of users registered for calculating spam liklihood
        const total_registered_users=await getRegisteredUsersCount();

        //If no user is registered with that phone number, search PersonalsContact table
        if(user=== null){
            users=await search_phone_in_contacts(search_number);

            //create a response array
            var users_array=[];

            for(let i=0;i<users.length;i++){
                //calculate spam liklihood for each result we got in the query
                var spam_data=await getSpamHits(users[i].phone);
                const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
                
                //create object
                const user_object={"name":users[i].name,"phone":users[i].phone,"spam_liklihood":spam_liklihood};

                //add the object to response array
                users_array[i]=user_object;
            }
            response_data=users_array;
        }
        //if a user with that phone number is registered
        else{

            //find spam liklihood
            const spam_data=await getSpamHits(user.phone);
            const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);

            //create object and assign response_data to it
            response_data={"user_id":user.user_id,"name":user.name,"phone":user.phone,"spam_liklihood":spam_liklihood};
        }
    }
    catch(err){
        console.log(err);
    }
    res.send(response_data);
}



//Spam liklihood calculator
const spam_liklihood_calculator=(spam_hits,spam_table_length,registered_users_count)=>{

    //spam_hits= number of times a number is marked spam
    //spam_table_length= total number of entries in spam table
    //registered_useres_count=total number of users registered. Only registered users can mark numbers as spam

    //look into Documentation.pdf for the logic behind the formula
    var spam_liklihood="";
    var weight1=(spam_hits/spam_table_length)*100;
    var weight2=(spam_hits/registered_users_count)*100;
    var total_weight=weight1+weight2;
   
    if(total_weight>=0 && total_weight<50)
        return "Very Low";
    if(total_weight>=50 && total_weight<100)
        return "Low";
    if(total_weight>=100 && total_weight<150)
        return "Moderate";
    return "High";
}

module.exports= { 
    search_with_name,
    search_with_number,
    spam_liklihood_calculator
}