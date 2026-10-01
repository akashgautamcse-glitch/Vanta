import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const User = useSelector((store) => store.User);
  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Vanta</Link>
      </div>
      {User && (<div className="flex gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-4">
            <div className="w-10 rounded-full">
              <img
                alt="User Photo"
                src={User.Photo_URL} />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>)}
    </div>
  )
}

export default Navbar;

