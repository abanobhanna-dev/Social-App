import { useContext, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";
import { IoSettingsSharp } from "react-icons/io5";
import { IoIosHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userLogin, setuserLogin } = useContext(AuthContext);

  const navigate = useNavigate();
  function LogOut() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
  }

  const iconClass = "text-3xl text-[#0d6e6e] hover:text-[#0a5a5a] transition";
  const logoutClass = "cursor-pointer bg-[#0d6e6e] hover:bg-[#0a5a5a] text-white px-5 py-2 rounded-lg font-medium transition shadow-sm";
  const authLinkClass = "text-gray-700 hover:text-[#0d6e6e] font-medium transition";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between md:grid md:grid-cols-3">

          {/* Left: Logo */}
          <div className="md:justify-self-start">
            <Link to="/home" className="text-2xl font-bold text-[#0d6e6e] hover:text-[#0a5a5a] transition">
              SocialApp
            </Link>
          </div>

          {/*Home + Profile + Settings (desktop) */}
          <div className="flex items-center gap-6 md:justify-self-center">
            {userLogin && (
              <>
                <Link to="/home" title="Home">
                  <IoIosHome className={iconClass} />
                </Link>

                <Link to="/profile" title="Profile">
                  <CgProfile className={iconClass} />
                </Link>

                <Link to="/ChangePassword" title="Settings" className="hidden md:block">
                  <IoSettingsSharp className={iconClass} />
                </Link>
              </>
            )}
          </div>

          {/* Right: Logout / Register+Login (desktop) + Hamburger (mobile) */}
          <div className="md:justify-self-end">
            <div className="hidden md:flex items-center gap-4">
              {userLogin ? (
                <button onClick={LogOut} className={logoutClass}>
                  LogOut
                </button>
              ) : (
                <>
                  <Link to="/register" className={authLinkClass}>
                    Register
                  </Link>
                  <Link to="/login" className={logoutClass}>
                    Login
                  </Link>
                </>
              )}
            </div>

            <button
              className="md:hidden text-[#0d6e6e] text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="flex flex-col items-start gap-4 mt-4 pt-4 pb-2 md:hidden border-t border-gray-100">
            {userLogin ? (
              <>
                <Link
                  to="/ChangePassword"
                  title="Settings"
                  className="flex items-center gap-3 text-gray-700 hover:text-[#0d6e6e] font-medium transition"
                  onClick={() => setIsOpen(false)}
                >
                  <IoSettingsSharp className="text-2xl" />
                  Settings
                </Link>

                <button onClick={LogOut} className={logoutClass}>
                  LogOut
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className={authLinkClass}>
                  Register
                </Link>
                <Link to="/login" className={logoutClass}>
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}