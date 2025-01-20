import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
export default function LoginForm() {
  // 메인 페이지로 이동
  const navigate = useNavigate();

  // 사용자 정보 State
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState({
    usernameError: "",
    passwordError: "",
  });

  // 사용자 정보 State 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };

  // 로그인 요청 핸들러
  const handleSubmit = async (event: React.FormEvent) => {
    console.log("handleSubmit");
    //default 이벤트 방지
    event.preventDefault();

    let isError = false;
    const newError = { usernameError: "", passwordError: "" };

    if (user.username === "") {
      isError = true;
      newError.usernameError = "Username is required";
    } else if (user.username.length < 3) {
      isError = true;
      newError.usernameError = "Username must be at least 3 characters";
    }

    if (user.password === "") {
      isError = true;
      newError.passwordError = "Password is required";
    } else if (user.password.length < 4) {
      isError = true;
      newError.passwordError = "Password must be at least 4 characters";
    }

    setError(newError);

    if (!isError) {
      // 로그인 요청
      try {
        // 로그인 요청 보내기
        const response = await fetch("http://localhost:3000/login", {
          // POST 요청
          method: "POST",
          // 헤더 설정
          headers: {
            "Content-Type": "application/json",
          },
          // 사용자 정보 보내기
          body: JSON.stringify(user),
        });
        // 응답 상태 확인
        if (!response.ok) {
          throw new Error(`Login error! status: ${response.status}`);
        }
        // 로그인 성공 시 인증 상태 설정
        useAuthStore.getState().login();
        navigate("/board");
      } catch (error) {
        // 에러 처리
        console.error("Error:", error);
      }
    }
  };

  return (
    // 로그인 폼
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center"
    >
      <div className="text-2xl font-bold mb-5 -mt-5">Login</div>
      <input
        type="text"
        id="username"
        placeholder="Username"
        value={user.username}
        onChange={handleChange}
        className="input input-bordered w-64 mb-5"
      />
      {error.usernameError && (
        <div className="text-red-500 mb-5">{error.usernameError}</div>
      )}
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
        className="input input-bordered w-64 mb-5"
      />
      {error.passwordError && (
        <div className="text-red-500 mb-5">{error.passwordError}</div>
      )}
      <button type="submit" className="btn btn-primary w-64">
        Login
      </button>
      {/* 깃허브 로그인 구현 */}
      <div
        className="btn btn-primary w-64 mt-5"
        onClick={() => {
          window.location.href =
            "http://localhost:8080/oauth2/authorization/github";
        }}
      >
        GitHub Login
      </div>
    </form>
  );
}
