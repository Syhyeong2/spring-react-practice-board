import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";

const useErrorHandler = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleBoardError = (status?: number) => {
    switch (status) {
      case 401:
        console.log("401 Unauthorized");
        logout();
        navigate("/auth");
        break;
      case 403:
        console.log("403 Forbidden");
        logout();
        navigate("/auth");
        break;
      case 404:
        console.log("404 Not Found");
        navigate("/board");
        break;
      default:
        console.log("Server Error");
    }
  };

  return { handleBoardError };
};

export default useErrorHandler;
