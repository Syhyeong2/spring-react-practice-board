import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
    console.log(user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        setError(false);
        navigate("/");
      } else {
        console.log(response);
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-2xl font-bold mb-5 -mt-5">Register</div>
      <input
        type="text"
        id="username"
        placeholder="Username"
        onChange={handleChange}
        className="input input-bordered w-64 mb-5"
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        onChange={handleChange}
        className="input input-bordered w-64 mb-5"
      />
      <input
        type="email"
        id="email"
        placeholder="Email"
        onChange={handleChange}
        className="input input-bordered w-64 mb-5"
      />
      {error && (
        <div className="text-red-500 text-center text-sm">회원가입 실패</div>
      )}
      <button onClick={handleSubmit} className="btn btn-primary w-64">
        Register
      </button>
    </div>
  );
}
