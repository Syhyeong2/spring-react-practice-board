import { Outlet } from "react-router-dom";

export default function AuthRoot() {
  return (
    <div className="flex flex-col font-mono items-center justify-center h-screen">
      <div className="text-3xl font-bold mb-14">:) Hello, world!</div>
      <Outlet />
    </div>
  );
}
