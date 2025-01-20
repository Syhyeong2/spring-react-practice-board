import apiClient, { ApiResponse } from "../utils/ApiClient";

interface IUser {
  username: string;
  password: string;
  email: string;
}

export const login = async (user: IUser): Promise<ApiResponse<any>> => {
  const response = await apiClient<any>(`/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
};

export const logout = async () => {
  const response = await apiClient<any>(`/logout`, {
    method: "POST",
  });
  return response;
};

export const refresh = async () => {
  const response = await apiClient<any>(`/refresh`, {
    method: "POST",
  });
  return response;
};
