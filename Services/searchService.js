
const {userExists,getRegisteredUsersCount,search_name_in_users}=require('../Dao/userDao');
const {search_phone_in_contacts,search_name_in_contacts}=require('../Dao/contactsDao');
const {getSpamHits}=require('../Dao/spamDao');

//SEARCH WITH A NAME
const search_with_name=async (req,res)=>{

    //the array which we will send
    var search_results=[];
    
    //Extract the Name/search-term from request object
    const search_term=req.params.name;

    try{
        //get data from Users table
        const user_table_entries=await search_name_in_users(search_term); 

        //get data from PersonalContacts table
        const contact_table_entries=await search_name_in_contacts(search_term);

        //combine all the data from both tables
        const all_entries=[...user_table_entries,...contact_table_entries];

        //get number of users registered for calculating spam liklihood
        const total_registered_users=await getRegisteredUsersCount();


        //calculate spam liklihood and create populate array
        for(let i=0;i<all_entries.length;i++){

            //Get Spam Data for each data entry
            var spam_data=await getSpamHits(all_entries[i].phone);

            //Number of times user marked as spam
            const spam_hits=spam_data.spam_hits;
            //Total number of Entries in spam table
            const spam_table_length=spam_data.spammers_count;
            //Caculate spam liklihood
            const spam_liklihood=spam_liklihood_calculator(spam_hits,spam_table_length,total_registered_users);

            const search_entry={"name":all_entries[i].name,"phone":all_entries[i].phone,"spam_liklihood":spam_liklihood};

            //add the result into the response array
            search_results[i]=search_entry;
        }

        //sort search results such that those entries whose name starts with a prefix comes first
        //define a comparator for custom sorting
        search_results.sort((a,b)=>{
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

    res.json(search_results);
}


//SEARCH WITH NUMBER FUNCTIONALITY
const search_with_number=async (req,res)=>{

    //extract phone number from URL
    const search_number=req.params.phone;
  
    try{

        //search if a user with that phone number is registered
        const user=await userExists(search_number);
        let users;
        let spam_data;
        
        
        //get number of users registered for calculating spam liklihood
        const total_registered_users=await getRegisteredUsersCount();

        //If no user is registered with that phone number, search PersonalsContact table
        if(user=== null){
            users=await search_phone_in_contacts(search_number);

            //create a response array
            var users_array=[];

            for(let i=0;i<users.length;i++){
                //calculate spam liklihood for each result we got in the query
                 spam_data=await getSpamHits(users[i].phone);
                const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);
                
                //create object
                const user_object={"name":users[i].name,"phone":users[i].phone,"spam_liklihood":spam_liklihood};

                //add the object to response array
                users_array[i]=user_object;
            }
            response_data=users_array;
        }
      

        //find spam liklihood
         spam_data=await getSpamHits(user.phone);
        const spam_liklihood=spam_liklihood_calculator(spam_data.spam_hits,spam_data.spammers_count,total_registered_users);

        //create object and assign response_data to it
        response_data={"user_id":user.user_id,"name":user.name,"phone":user.phone,"spam_liklihood":spam_liklihood};
        
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