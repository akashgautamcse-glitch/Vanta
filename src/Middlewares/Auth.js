const jwt = require("jsonwebtoken");
const { user } = require("../models/user");

const userAuth = async(req,res,next)=> {
  try{
    const {token} = req.cookies;
    
    if(!token || token === "undefined"){
      throw new Error("token not found!!");
    }
    const decodedData =  jwt.verify(token, process.env.SPECIAL_KEY);
    const { _id } = decodedData;
    const User = await user.findById(_id);
    if(!User){
      throw new Error("User is not found ");  
    }
    req.User = User;
    next();
  } catch (err){
    res.status(505).send("ERROR: " + err.message);
  }
}

module.exports = {
  userAuth,
}