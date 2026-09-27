const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user",
      required : true
    },
    toUserId : {
      type : mongoose.Schema.Types.ObjectId,
      required : true
    },
    Status : {
      type : String,
      required : true,
      enum : {
        values : ['Interested','Ignored', 'Accepted', 'Rejected'],
        message : '{VALUE} is not supported'
      }
      
    }
}, 
{ 
  timeStamps : true
}
);

const connectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {connectionRequest};