import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, sendMail } from "../../api/authApi";
import InfoCard from "../common/InfoCard";
import "./RegisterCard.css";

const RegisterCard = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [info, setInfo] = useState<{
    type: "ok" | "error" | "warning";
    title: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    try {
      const mailData = await sendMail(email);
      if (mailData.success) {
        const response = await register(formData);
        if (response.success) {
          setInfo({
            type: "ok",
            title: "Registration Successful",
            description:
              "You have been successfully registered. You can login now.",
          });
        } else {
          setInfo({
            type: "error",
            title: "Registration Failed",
            description: response.error || "An unknown error occurred.",
          });
        }
      } else {
        setInfo({
          type: "error",
          title: "Email Sending Failed",
          description:
            mailData.error ||
            "An unknown error occurred while sending the email.",
        });
      }
    } catch (error) {
      console.error("Error in the process:", error);
      setInfo({
        type: "error",
        title: "Process Error",
        description:
          "An error occurred while processing your request. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseInfoCard = () => {
    if (info?.type === "ok") {
      navigate("/login");
    }
    setInfo(null);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 position-relative">
      {info && (
        <InfoCard
          type={info.type}
          title={info.title}
          description={info.description}
          onClose={handleCloseInfoCard}
        />
      )}
      {isLoading && (
        <div className="loading-spinner position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div
        className={`card shadow-lg ${isLoading ? "blur-background" : ""}`}
        style={{ width: "400px" }}
      >
        <div className="card-body">
          <h5 className="card-title text-center">Register</h5>
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
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
                  backgroundColor: password.length > 0 && password.length < 8 ? "#FFCCCB" : "",
                }}
                required
              />
              {password.length > 0 && password.length < 8 && (
                <small className="text-danger">
                  Password must be at least 8 characters
                  long.
                </small>
              )}
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
              {!passwordMatch && (
                <small className="text-danger">
                  Passwords do not match.
                </small>
              )}
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
