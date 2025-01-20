import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// 인증 상태 인터페이스
interface IAuthStore {
  // 인증 상태
  isAuthenticated: boolean;
  // 인증 상태 설정 함수
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      // 로컬 스토리지 사용
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
