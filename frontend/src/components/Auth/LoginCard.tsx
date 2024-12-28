import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IUser } from "../../models/IUser";
import { login } from "../../api/authApi";
import InfoCard from "../common/InfoCard";
import { useUser } from "./UserContext";

const LoginCard = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState<{
    type: "ok" | "error" | "warning";
    title: string;
    description: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const user: IUser = {
      username: username,
      password: password,
    };

    login(user)
      .then((response) => {
        if (response.success) {
          setUser(response.user);
          setInfo({
            type: "ok",
            title: "Login Successful",
            description: "You have been successfully logged in.",
          });
        } else {
          console.error("Login failed:", response.error);
          setInfo({
            type: "error",
            title: "Login Failed",
            description: response.error,
          });
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
        setInfo({
          type: "error",
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        });
      });
  };

  const handleCloseInfoCard = () => {
    if (info?.type === "ok") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      {info && (
        <InfoCard
          type={info.type}
          title={info.title}
          description={info.description}
          onClose={handleCloseInfoCard}
        />
      )}
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body">
          <h5 className="card-title text-center">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-2">
              Login
            </button>
          </form>
          <p className="mb-0 text-muted">
            New to StudyBuddy?{" "}
            <Link to="/register" className="text-dark">
              Sign up now
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
