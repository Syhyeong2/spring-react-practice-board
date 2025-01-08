import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// 인증 상태 인터페이스
interface IAuthStore {
  // 토큰
  token: string;
  // 인증 상태
  isAuthenticated: boolean;
  // 인증 상태 설정 함수
  setAuthenticated: (
    isAuthenticated: boolean,
    user: string,
    token: string
  ) => void;
  // 로그아웃 함수
  logout: () => void;
  // 사용자 정보
  user: string;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      // 토큰 초기값
      token: "",
      // 사용자 정보
      user: "",
      // 인증 상태 초기값
      isAuthenticated: false,
      // 인증 상태 설정 함수
      setAuthenticated: (
        isAuthenticated: boolean,
        user: string,
        token: string
      ) => set({ isAuthenticated: true, user, token }),
      // 로그아웃 함수
      logout: () => set({ token: "", isAuthenticated: false, user: "" }),
    }),
    {
      // 로컬 스토리지 사용
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
