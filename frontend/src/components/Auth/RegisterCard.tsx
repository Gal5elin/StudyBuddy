import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../api/authApi";
//import { IUser } from "../../models/IUser";

const RegisterCard = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        setPasswordMatch(value === confirmPassword);
        break;
      case "confirm_password":
        setConfirmPassword(value);
        setPasswordMatch(value === password);
        break;
      case "profile_pic":
        if (e.target.files) {
          setProfilePic(e.target.files[0]);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    register(formData)
      .then((response) => {
        if (response.success) {
          console.log("User registered:", response.user);
        } else {
          console.error("Registration failed:", response.error);
        }
      })
      .catch((error) => {
        console.error("Error registering:", error);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body">
          <h5 className="card-title text-center">Register</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

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
                value={username}
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
                value={password}
                onChange={handleChange}
                style={{
                  backgroundColor: passwordMatch ? "" : "#FFCCCB",
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirm_password" className="form-label">
                Confirm password:
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                className="form-control"
                placeholder="Enter your password"
                value={confirmPassword}
                onChange={handleChange}
                style={{
                  backgroundColor: passwordMatch ? "" : "#FFCCCB",
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="profile_pic" className="form-label">
                Profile Picture:
              </label>
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="form-control"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-2">
              Register
            </button>
          </form>
          <p className="mb-0 text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-dark">
              Login now
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCard;
