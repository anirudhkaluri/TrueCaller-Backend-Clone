const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const secret_key=process.env.TOKEN_SECRET;

function generateAccessToken(userid){
    const token=jwt.sign(userid, secret_key.toString(), { expiresIn: '1800s' });
    return token;
}

function authenticateToken(req, res, next) {
    
    //const userid_cookie = req.cookies.userid;
    const userid_cookie = req.headers['authorization'];
    const token = userid_cookie && userid_cookie.split(' ')[1];
  
    if (token == null) return res.sendStatus(401)
   
    jwt.verify(token, secret_key.toString() , (err, user) => {
     
    
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


