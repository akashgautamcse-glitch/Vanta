import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser} from "../utils/userSlice";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.User)

  const fetchUser = async () => {
    if(userData) return;

    try{
      const res = await axios.get(BASE_URL + "/profile/view",{
        withCredentials: true
      });
      dispatch(addUser(res.data));
    }
    catch(err){
      if(err.status === 401){
        navigate("/login");
      }
      console.error(err);      
    }   
  }

  useEffect(() => {
    fetchUser();
  }, []);
  
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
    
  )
}

export default Body;