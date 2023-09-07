import jwt from 'jsonwebtoken'
import configEnv from "./configEnv";

const generateToken=async(email)=>{
    const token=await jwt.sign(
        {email},
        process.env.TOKEN_SECRET,{
            expiresIn:'8h'
        }
    )
    return token;
}

export default generateToken;