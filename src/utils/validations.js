const validator = require('validator');
//Sign-up Validation
const validatesignupdata = ((req) =>{
  const{FirstName, LastName, email_id, Password} = req.body;

  if(!FirstName || !LastName){
    throw new Error("Please Enter your full Name");
  }
  else if(!validator.isEmail(email_id)){
    throw new Error("Please enter valid email");
  }
  else if(!validator.isStrongPassword(Password)){
    throw new Error("Password is not strong enough!");
  }
});

//login validation
const validatelogindata = ((email_id) => {

  if(!validator.isEmail(email_id)){
    throw new Error("Enter valid Email");
    
  }
});

const validateupdates = ((req) => {
  try{
  const allowedUpdates = ["FirstName", "LastName", "Bio", "Skills", "Photo_URL"];

  const isallowed = Object.keys(req.body).every((k) => allowedUpdates.includes(k));

  return isallowed;
  }
  catch (err){
    res.status(500).send("ERROR: " + err.message);
  }
});

module.exports = {
  validatesignupdata,
  validatelogindata,
  validateupdates,
}
