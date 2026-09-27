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
    default : "https://imgs.search.brave.com/9FMIcS4iOWxn3c5sr7V0xb-7U6pGsaxB-qiP0gde5P8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDIv/MzMyLzA5Ni9zbWFs/bC9kZWZhdWx0LWF2/YXRhci1wcm9maWxl/LWljb24tcHJvZmls/ZS1wbGFjZWhvbGRl/ci1hbm9ueW1vdXMt/dXNlci1tYWxlLW5v/LXBob3RvLXdlYi10/ZW1wbGF0ZS1kZWZh/dWx0LXVzZXItcGlj/dHVyZS1mb3Itc29j/aWFsLW5ldHdvcmtz/LXJlc3VtZS1mb3J1/bXMtYW5kLWRhdGlu/Zy1zaXRlcy1ncmV5/LXBob3RvLXBsYWNl/aG9sZGVyLWZyZWUt/dmVjdG9yLmpwZw",
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