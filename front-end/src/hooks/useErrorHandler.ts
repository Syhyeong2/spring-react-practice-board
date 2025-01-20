import { useNavigate } from "react-router-dom";
import apiClient from "../utils/ApiClient";
import { logout } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

// Define a type for the response data
interface RefreshResponse {
  accessToken: string;
}

const useErrorHandler = () => {
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
            useAuthStore.getState().login();
          } else {
            await logout();
            useAuthStore.getState().logout();
            navigate("/auth");
          }
        } catch (error) {
          await logout();
          useAuthStore.getState().logout();
          navigate("/auth");
        }

        break;
      case 403:
        console.log("403 Forbidden");
        await logout();
        useAuthStore.getState().logout();
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
