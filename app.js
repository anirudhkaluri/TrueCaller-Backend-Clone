const db=require('./models');
const express=require("express");
const app=express();
const session=require('express-session');
const cors=require('cors');

const cookieParser=require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
const {populate_all_data}=require('./Data/populateData');

app.use(cors({
    origin: [
        
    ],
    credentials:true
  }));





//import the route files
const searchRoutes=require("./Routes/searchRoutes");
const spamRoutes=require("./Routes/spamRoutes");
const userRoutes=require("./Routes/userRoutes");

//configure the routes by scoping them
app.use("/profileService",userRoutes);
app.use("/searchService",searchRoutes);
app.use("/spamService",spamRoutes);

app.use((req, res, next) => {
    res.status(404).send("Sorry, we can't find that resource!");
});




const PORT= process.env.PORT||8000; 

db.sequelize.sync()
.then(async (res)=>{
    const str=await populate_all_data();
    app.listen(PORT,()=>{
        console.log(`listening to PORT=${PORT}`);
    });
})
.catch((err)=>{
    console.log("error creating the database schema in the file");
    console.log(err);
});

module.exports=app; 




