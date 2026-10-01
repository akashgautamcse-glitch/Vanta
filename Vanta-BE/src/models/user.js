const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  FirstName : {
    type : String,
    required : true,
    minLength : 4,
    maxLength : 20,
  },
  LastName : {
    type : String,
    maxlength : 50,
  },
  email_id : {
    type : String,
    required : true,
    lowercase : true,
    trim : true,
    unique : true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email" + value);     
      }
    }
  },
  Password : {
    type : String,
    required : true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Password is not strong");
        
      }
    }
  },
  age : {
    type : Number,
    min : 18,
  },
  gender : {
    type : String,
    validate(value){
      if(!["male", "female", "others"].includes(value)){
        throw new Error("gender is not valid");
        
      }
    }
  },
  Bio : {
    type : String,
    default : "This is default a description",
    maxLength : 100,
  },
  Photo_URL : {
    type : String,
    default : "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg?semt=ais_hybrid&w=740&q=80",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Please,insert valid url");
        
      }
    }
  },
  Skills : {
    type :  [String],
  }
}, {timestamps : true})

userSchema.methods.validatePassword = async function(inputPassword){
  const user = this;
  const isPasswordValid = await bcrypt.compare(inputPassword, user.Password);

  return isPasswordValid;
}

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({_id : user._id}, process.env.SPECIAL_KEY, {expiresIn : "7d"});

  return token;
}


const user = mongoose.model("User", userSchema);



module.exports = {
  user,
}