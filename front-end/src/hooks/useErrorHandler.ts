import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/UseAuthStore";
import apiClient from "../utils/ApiClient";

// Define a type for the response data
interface RefreshResponse {
  accessToken: string;
}

const useErrorHandler = () => {
  const { logout, setToken } = useAuthStore();
  const navigate = useNavigate();

  const handleBoardError = async (status?: number) => {
    switch (status) {
      case 401:
        console.log("401 Unauthorized");
        try {
          const response = await apiClient<RefreshResponse>("/refresh", {
            method: "POST",
          });
          if (response.status === 200 && response.data) {
            setToken(response.data.accessToken);
          } else {
            logout();
            navigate("/auth");
          }
        } catch (error) {
          logout();
          navigate("/auth");
        }

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
