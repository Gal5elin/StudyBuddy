import { Link } from "react-router-dom";
import { useState } from "react";
import { IUser } from "../../models/IUser";
import { login } from "../../api/authApi";

const LoginCard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
          console.log("User logged in. Token stored in localStorage.");
          
        } else {
          console.error("Login failed:", response.error);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
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
