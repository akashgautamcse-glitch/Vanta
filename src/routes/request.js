const express = require('express');
const requestRouter = express.Router();
const{ userAuth } = require('../Middlewares/Auth');
const { user } = require('../models/user');
const { connectionRequest } = require('../models/connectionRequest')

requestRouter.post("/request/send/:status/:toUserId", userAuth,async(req, res)=>{
  try{
    const fromUserId = req.User._id;
    const toUserId = req.params.toUserId;
    const Status = req.params.status;

    const allowedStatus = ['Interested','Ignored'];
    if(!allowedStatus.includes(Status)){
      res.status(515).json({message : 'status not valid!'});
    }

    if(fromUserId.toString() === toUserId.toString()){
      return res.status(400).json({message : 'Cannot send request to ownself'});
    }

    const toUser = await user.findById(toUserId);
    if(!toUser){
      return res.status(404).json({message : 'User not found'});
    }

    const isConnectionRequestExist = await connectionRequest.findOne({
      $or:[
        {fromUserId, toUser},
        {fromUserId : toUserId, toUserId:fromUserId}
      ]
    })
    if(isConnectionRequestExist){
      return res.status(528).json({messsage : 'Connection request already exist'});
    }

    const newConnectionRequest = new connectionRequest({
      fromUserId,
      toUserId,
      Status
    });
    const data = await newConnectionRequest.save();
    res.json({message : 'Connection request Send', data});
  }catch(err){
    res.status(530).json({message : "Something went wrong " + err.message});
  }
});

requestRouter.patch("/request/review/:status/:requestId", userAuth, async(req, res)=> {
  try{
    const loggedInUser = req.User;
    const { status, requestId} = req.params;

    const allowedStatus = ["Accepted", "Rejected"];
    const isAllowed  = allowedStatus.includes(status);
    if(!isAllowed){
      return res.status(400).json({message : "Status not valid :("});
    };

    const ConnectionRequest = connectionRequest.findOne({_id : requestId, touser : loggedInUser, status : 'Interested'});
    if(!ConnectionRequest){
      return res.status(404).json ({message : "request is not exist"});
    }

    connectionRequest.Status = status;
    const data = await connectionRequest.save();
    res.status(408).json({message : "Request is accepted", data});    
  }
  catch(err){
    req.status(300).json({message : "Something is wrong " + err.message});
  }
});

module.exports = requestRouter;