import { jwtDecode } from "jwt-decode";
import { IUser } from "../models/IUser";

const Navbar = () => {
  const token = localStorage.getItem("token");
  let user: IUser | null = null;

  if (token) {
    try {
      user = jwtDecode<IUser>(token);
    } catch (error) {
      console.error("Invalid token:", error);
    }

    console.log("User:", user);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            StudyBuddy
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link" href="/subjects">
                Subjects
              </a>
            </div>
            <div className="ms-auto">
              {user ? (
                <a className="nav-link" href="/dashboard">
                  <img
                  src={
                    user.profile_pic
                    ? `http://localhost:8080/${user.profile_pic}`
                    : "/path/to/default/profile-picture.jpg"
                  }
                  alt="Profile"
                  className="rounded-circle"
                  width="30"
                  height="30"
                  />
                </a>
              ) : (
                <a className="nav-link" href="/login">
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
