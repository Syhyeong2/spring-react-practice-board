import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export const Oauth2Callback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    useAuthStore.getState().login();
    navigate("/board");
  }, []);

  return <div>Loading...</div>;
};
