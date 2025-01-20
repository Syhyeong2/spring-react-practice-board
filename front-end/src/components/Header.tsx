import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { logout } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

export default function Header() {
  // 인증 상태 함수 가져오기

  // 페이지 이동을 위한 함수 가져오기
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = async () => {
    await logout();
    useAuthStore.getState().logout();
    navigate("/auth");
  };

  // 테스트 인증 함수
  const handleTestAuth = async () => {
    try {
      // 테스트 인증 요청
      const response = await fetch("http://localhost:3000/test", {});
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // 토큰 만료 시 재인증 처리
          alert("Session expired. Please log in again.");
          //to-do 로그아웃 처리
          navigate("/auth");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="navbar bg-opacity-100 fixed top-0 left-0 right-0 z-10">
      <div className="flex-1 ">
        <Link to="/board" className="btn btn-ghost text-xl">
          Hello world!
        </Link>
      </div>

      {/* 로그아웃 */}
      <button className="btn btn-ghost" onClick={handleLogout}>
        Logout
      </button>
      {/* 테스트 인증 */}
      <button className="btn btn-ghost" onClick={handleTestAuth}>
        test auth
      </button>
    </div>
  );
}
