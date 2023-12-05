import Loader from "../../components/Loader";
import { setLogOut } from "../../store/actions/user";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["access_token", "refresh_token"]);

  useEffect(() => {
    const performLogout = async () => {
      try {
        removeCookie("access_token");
        removeCookie("refresh_token");
        sessionStorage.removeItem("beforePathname");
        setLogOut();
        navigate("/auth/login");
      } catch (error) {
        console.error("Logout failed:", error);
        // Handle logout failure
      }
    };

    performLogout(); // Initiates logout process

    // No cleanup required in this case
  }, []);

  return <Loader className="fixed top-0 left-0 z-[9999]" />;
};

export default Logout;
