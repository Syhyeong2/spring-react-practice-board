import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Auth() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-lg mb-2">you have ID?</div>
      <Link to="/auth/login" className="btn btn-primary w-64 mb-5">
        Login
      </Link>
      <div className="text-lg mb-2">you don't have ID?</div>
      <Link to="/auth/register" className="btn btn-primary w-64">
        Register
      </Link>
    </div>
  );
}
