import apiClient, { ApiResponse } from "../utils/ApiClient";
import { IBoardListResponse, IBoardWriteRequest } from "../types/BoardTypes";

//게시글 목록 조회
export const getBoardList = async (
  //페이지네이션을 위한 파라미터
  params: string,
  //JWT
  token: string
): Promise<ApiResponse<IBoardListResponse>> => {
  //서버 통신
  const response = await apiClient<IBoardListResponse>(
    `/api/board/boardList?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

//게시글 상세 조회
export const getBoardDetail = async (
  //게시글 아이디
  id: string,
  //JWT
  token: string
): Promise<ApiResponse<any>> => {
  //서버 통신
  const response = await apiClient<any>(`/api/board/boardDetail/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

//게시글 삭제
export const deleteBoard = async (
  //게시글 아이디
  id: string,
  //JWT
  token: string
): Promise<ApiResponse<any>> => {
  //서버 통신
  const response = await apiClient<any>(`/api/board/boardDelete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

//게시글 작성
export const writeBoard = async (
  //작성 게시글 오브젝트
  board: IBoardWriteRequest,
  //JWT
  token: string
): Promise<ApiResponse<any>> => {
  //서버 통신
  const response = await apiClient<any>(`/api/board/boardWrite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board),
  });
  return response;
};

export const updateBoard = async (
  //수정 게시글 오브젝트
  board: IBoardWriteRequest,
  //게시글 아이디
  id: string,
  //JWT
  token: string
): Promise<ApiResponse<any>> => {
  //서버 통신
  const response = await apiClient<any>(`/api/board/boardUpdate/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board),
  });
  return response;
};

// 게시글 검색
export const searchBoard = async (
  //검색과 페이지네이션을 위한 파라미터
  params: string,
  //JWT
  token: string
): Promise<ApiResponse<any>> => {
  //서버 통신
  const response = await apiClient<any>(
    `/api/board/boardList/search?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
