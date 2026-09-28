import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email_id, setEmailId] = useState("akash@gmail.com");
  const [Password, setPassword] = useState("Akash@123");

  const handleLogin = async () => {
    try{
      const res = await axios.post("http://localhost:9000/login",{
      email_id,
      Password,
      },{withCredentials : true}
      )
    }
    catch(err){
      console.error(err);
    }
  }

  return(
  <div className="flex justify-center my-25">
    <div className="card bg-base-300 w-96 shadow-sm ">
      <div className="card-body">
        <h2 className="card-title justify-center">Login</h2>
        <div>
          <fieldset className="fieldset my-2">
            <label className="label" htmlFor="name">Email ID</label>
            <input type="text" id="name" className="input" value={email_id} onChange={(e)=> setEmailId(e.target.value)}/>
          </fieldset>
          <fieldset className="fieldset my-2">
            <label className="label" htmlFor="password">Password</label>
            <input type="text" id="name" className="input" value={Password} onChange={(e)=> setPassword(e.target.value)}/>
          </fieldset>
        </div>
        <div className="card-actions justify-center">
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  </div>  
  )
}

export default Login;