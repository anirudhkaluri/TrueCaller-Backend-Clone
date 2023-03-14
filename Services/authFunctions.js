const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();


function generateAccessToken(userid){
    return jwt.sign(userid, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
     
  
      if (err) {
        console.log(err);
        return res.sendStatus(403); //send error code
      }
  
      req.user = user
  
      next()
    })
}


module.exports={
    generateAccessToken,
    authenticateToken
}


