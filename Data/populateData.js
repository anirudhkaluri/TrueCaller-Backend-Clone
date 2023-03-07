const {User,PersonalContact,SpamNumber,Credential}=require('../models');
const sequelize=User.sequelize;

//populate User and Password

const populate_all_data=async ()=>{

    var user1=await User.create({
        name:"anirudh",
        phone:"8919312196",
        email:"random123@gmail.com"
    });
    await Credential.create({
        user_id:user1.user_id,
        password:'root'
    });

    var user2=await User.create({
        name:"ramu",
        phone:"1234567890",
        email:"random321@gmail.com"
    });
    await Credential.create({
        user_id:user2.user_id,
        password:'root'
    });

    var user3=await User.create({
        name:"somu",
        phone:"0987654321",
        email:"random890@gmail.com"
    });
    await Credential.create({
        user_id:user3.user_id,
        password:'root'
    });

    await SpamNumber.create({
        user_id:user1.user_id,
        phone:"5675675678"
    });

    await SpamNumber.create({
        user_id:user2.user_id,
        phone:"5675675678"
    });

    await SpamNumber.create({
        user_id:user3.user_id,
        phone:"5675675678"
    });


    await SpamNumber.create({
        user_id:user2.user_id,
        phone:"1231231234"
    });

    await SpamNumber.create({
        user_id:user3.user_id,
        phone:"1231231234"
    });

    await PersonalContact.create({
        user_id:user1.user_id,
        name:"veeresh",
        phone:"5675675678",
        email:null
    });

    await PersonalContact.create({
        user_id:user2.user_id,
        name:"venkatesh",
        phone:"5675675678",
        email:null
    });

    await PersonalContact.create({
        user_id:user2.user_id,
        name:"somesh",
        phone:"1231231234",
        email:null
    });

    await PersonalContact.create({
        user_id:user3.user_id,
        name:"somesh",
        phone:"1231231234",
        email:null
    });

    await PersonalContact.create({
        user_id:user1.user_id,
        name:"ramu",
        phone:user2.phone,
        email:null
    });

    await PersonalContact.create({
        user_id:user2.user_id,
        name:"anirudh",
        phone:user1.phone,
        email:null
    });

    await PersonalContact.create({
        user_id:user1.user_id,
        name:"ramana",
        phone:"9885988500",
        email:null
    });




    return "success";

}

module.exports={
    populate_all_data
}
