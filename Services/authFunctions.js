const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

//IMPORT THE TOKEN SECRET
process.env.TOKEN_SECRET;

function generateAccessToken(userid){
    return jwt.sign(userid, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


