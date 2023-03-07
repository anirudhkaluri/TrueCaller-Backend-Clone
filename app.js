const db=require('./models');
const express=require("express");
const app=express();


//import the route files
const searchRoutes=require("./Routes/searchRoutes");
const spamRoutes=require("./Routes/spamRoutes");
const userRoutes=require("./Routes/userRoutes");

//configure the routes by scoping them
app.use("/profileService",userRoutes);
app.use("/searchService",searchRoutes);
app.use("/spamService",spamRoutes);



app.use(express.json());
app.use(express.urlencoded());




const PORT= process.env.PORT||8000; 

db.sequelize.sync()
.then((res)=>{
    app.listen(PORT,()=>{
        console.log(`listening to PORT=${PORT}`);
    });
})
.catch((err)=>{
    console.log("error creating the database schema in the file");
    console.log(err);
});

module.exports=app; //FOR TESTING




