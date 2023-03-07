const db=require('./models');
const express=require("express");
const app=express();

//const apiRoutes=require("./apiRouttes");



//app.use(apiRoutes);

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




