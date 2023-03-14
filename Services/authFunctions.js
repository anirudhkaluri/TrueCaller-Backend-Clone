const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const secret_key="09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

function generateAccessToken(userid){
    const token=jwt.sign(userid, secret_key, { expiresIn: '1800s' });
    console.log("THE TOKEN CREATED IS");
    console.log(token);
    return token;
}

function authenticateToken(req, res, next) {
    
    //const userid_cookie = req.cookies.userid;
    const userid_cookie = req.headers['authorization'];
    const token = userid_cookie && userid_cookie.split(' ')[1];
  
    if (token == null) return res.sendStatus(401)
   
    jwt.verify(token, secret_key , (err, user) => {
     
    
      if (err) {
        console.log("WE GOT AN ERROR WHILE AUTHENTICATING JWT TOKEN");
        console.log(err);
        return res.sendStatus(403); //send error code
      }
      console.log("THE USER IS",user);
      req.user = user
  
      next()
    })
}


module.exports={
    generateAccessToken,
    authenticateToken
}


