const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../Middlewares/Auth');
const { connectionRequest } = require('../models/connectionRequest');
const { user } = require('../models/user');
const USER_DATA = "FirstName LastName Photo_URL age Bio Skills";

userRouter.get("/user/requests/receives", userAuth, async(req, res)=>{
  try{
    const loggedInUser = req.User;

    const ConnectionRequest = await connectionRequest.find({
      toUserId : loggedInUser._id,
      Status : "Interested"
    }).populate("fromUserId", USER_DATA);
    if(!ConnectionRequest){
      return res.status(400).json({message : "Connection Request not found"});
    }

    res.json({ConnectionRequest});
  }
  catch(err){
    res.status(420).json({message : "Something is wrong :( " + err.message});
  }
});

userRouter.get("/user/connections", userAuth, async(req, res)=>{
  try{
    const loggedInUser = req.User;

    const Connections = await connectionRequest.find({
      $or:[
        {fromUserId : loggedInUser._id, Status : "Accepted"},
        {toUserId : loggedInUser._id, Status : "Accepted"}
      ]
    }).populate("fromUserId" , USER_DATA)
    .populate("toUserId", USER_DATA);

    const data = Connections.map((row)=> {
      if(row.toUserId._id.toString() === loggedInUser._id){
        return row.fromUserId;
      }
      return row.toUserId;
    });

    res.json({data});
  }
  catch(err){
    res.status(425).json({message : "Something is wrong :( " + err.message});
  }
});

userRouter.get("/user/feed", userAuth, async (req, res)=>{
  try{
    const loggedInUser = req.User;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50 : limit;
    const skip = (page-1)*limit;

    const ConnectionRequest = connectionRequest.find({
      $or : [
        {fromUserId : loggedInUser._id},
        {toUserId : loggedInUser._id}
      ]
    });
    const hideUserFromFeed = new Set();
    ConnectionRequest.forEach((element) => {
      hideUserFromFeed.add(element.fromUserId);
      hideUserFromFeed.add(element.toUserId);
    });
    const feed = user.find({
      $and : [
      {id : {$nin : Array.from(hideUserFromFeed)}},
      {_id : {$ne : loggedInUser._id}}
      ]
    }).select(USER_DATA).skip(skip).limit(limit);

    res.json({feed});

  }
  catch(err){
    res.status(450).json({message : "Something went wrong ;( " + err.message});
  }
})
module.exports = userRouter;