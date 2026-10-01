const express = require('express');
const authRouter = express.Router();
const{ validatesignupdata, validatelogindata} = require('../utils/validations');
const bcrypt = require('bcrypt');
const { user } = require('../models/user');

authRouter.post("/signup", async(req, res) => {
  try{
      validatesignupdata(req);

      const { FirstName, LastName, email_id, Password} = req.body;

      //Encrypt Password
      const hashPassword = await bcrypt.hash(Password,10);

      //creating Obj. of model
      const User = new user({
        FirstName,
        LastName,
        email_id,
        Password : hashPassword
      });

     //saving user to DB 
     await User.save();
     res.send("Signed-up Successfully");
  }
  catch (err){
    res.status(500).send("ERROR:" + err.message);
  } 
});

authRouter.post("/login", async(req, res) =>{
  try{
    //validate email id
    validatelogindata(req.body.email_id);
    if(!validatelogindata){
      throw new Error("Invalid emailId"); 
    }

    const {email_id, Password} = req.body;
    
    const User = await user.findOne({"email_id" : email_id});
    if(!User){
      throw new Error("Invalid Credentials");
    }
  
    const isPasswordValid = await User.validatePassword(Password);

    if(!isPasswordValid){
      throw new Error("Invalid Credentials");
    }

    //generate token
    const token = await User.getJWT();

    res
      .cookie("token", token)
      .send(User);
  }
  catch (err){
    res.status(500).send("ERROR:" + err.message);
  } 
});

authRouter.post("/logout", async(req, res) =>{ 
  try{
    res
      .cookie("token", null,{
        expires : new Date(Date.now()),
        maxAge : 0
      })
      .send("Logged out");
    }
    catch (err){
      res.status(510).send("ERROR:" + err.message);
    }
});

module.exports = authRouter;