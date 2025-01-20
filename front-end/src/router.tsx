import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./Root";
import BoardList from "./pages/BoardList";
import LoginForm from "./pages/Auth/LoginFrom";
import RegisterForm from "./pages/Auth/RegisterForm";
import AuthHome from "./pages/Auth/AuthHome";
import BoardWrite from "./pages/BoardWrite";
import BoardDetail from "./pages/BoardDetail";
import AuthRoot from "./pages/AuthRoot";
import BoardSearch from "./pages/BoardSearch";
import { useAuthStore } from "./store/useAuthStore";
import { Oauth2Callback } from "./components/Oauth2Callback";

// 인증된 사용자만 접근 가능한 라우트
function AuthenticatedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

// 인증되지 않은 사용자만 접근 가능한 라우트
function UnauthenticatedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/board" />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // 인증된 사용자만 접근 가능한 라우트로 감싸기
      <AuthenticatedRoute>
        <Root />
      </AuthenticatedRoute>
    ),
    children: [
      {
        path: "/board",
        element: <BoardList />,
      },
      {
        path: "/board/write",
        element: <BoardWrite />,
      },
      {
        path: "/board/:id",
        element: <BoardDetail />,
      },
      {
        path: "/board/search/:query",
        element: <BoardSearch />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      // 인증되지 않은 사용자만 접근 가능한 라우트로 감싸기
      <UnauthenticatedRoute>
        <AuthRoot />
      </UnauthenticatedRoute>
    ),
    children: [
      {
        path: "/auth",
        element: <AuthHome />,
      },
      {
        path: "/auth/login",
        element: <LoginForm />,
      },
      {
        path: "/auth/register",
        element: <RegisterForm />,
      },
    ],
  },
  {
    path: "/oauth2/callback",
    element: <Oauth2Callback />,
  },
]);

export default router;
