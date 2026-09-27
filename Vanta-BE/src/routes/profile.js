const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../Middlewares/Auth');
const{ user } = require('../models/user');
const { validateupdates } = require('../utils/validations');
const bcrypt = require('bcrypt');
 
profileRouter.get("/profile/view", userAuth,async (req, res)=> {
 try{
    const User = req.User;
    res.send(User);
 }
  catch (err){
    res.status(500).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
  try{
    validateupdates(req);
    if(!validateupdates){
      throw new Error("This field can't be updated");
    }
    const loggedInUser = req.User;
    
     Object.keys(req.body).forEach((key) =>  (loggedInUser[key] = req.body[key]));
    
    await loggedInUser.save();
    res.send("update successful")
  }
  catch (err){
    res.status(501).send("ERROR: " + err.message);
  } 
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try{
    const {currentPassword, newPassword} = req.body;
    const loggedInUser = req.User;
    
    const ispasswordcorrect = await loggedInUser.validatePassword(currentPassword);
    
    if(!ispasswordcorrect){
      throw new Error("Current password is wrong");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.Password = newPasswordHash;

   await loggedInUser.save();
   res.send("Password changed");   
  }
  catch(err) {
    res.status(504).send("ERROR:" + err.message);
  }
});
module.exports = profileRouter;

