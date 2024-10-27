import { Link } from "react-router-dom";

const handleChange = () => {};

const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
};

const LoginCard = () => {
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
