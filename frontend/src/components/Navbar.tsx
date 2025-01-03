import { useEffect, useState } from "react";
import { getProfilePic } from "../api/usersApi";
import { useUser } from "./Auth/UserContext";

const Navbar = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { user, loading } = useUser();

  const fetchProfilePic = async () => {
    try {
      const picUrl = await getProfilePic();
      setProfilePic(picUrl);
    } catch (error) {
      setProfilePic(null);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchProfilePic();
    }
  }, [user, loading]);

  return (
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
          <div className="ms-auto d-flex align-items-center">
            {user ? (
              <a className="nav-link d-flex align-items-center" href="/dashboard">
                {profilePic && user && !loading ? (
                  <img
                    src={profilePic}
                    className="rounded-circle"
                    width="30"
                    height="30"
                  />
                ) : (
                  <div
                    className="bg-secondary rounded-circle"
                    style={{ width: "30px", height: "30px" }}
                  ></div>
                )}
                <span className="ms-2">{user.username}</span>
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
  );
};

export default Navbar;
