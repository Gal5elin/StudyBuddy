import { useEffect, useState } from "react";
import { getProfilePic } from "../api/usersApi";
import { useUser } from "./Auth/UserContext";

const Navbar = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { user, loading } = useUser();

  useEffect(() => {
    let isMounted = true;

    const fetchProfilePic = async () => {
      try {
        const picUrl = await getProfilePic();
        if (isMounted) {
          setProfilePic(picUrl);
        }
      } catch (error) {
        console.error("Failed to fetch profile picture", error);
      }
    };

    if (user && !loading) {
      fetchProfilePic();
    } else {
      setProfilePic(null);
    }

    return () => {
      if (profilePic) {
        URL.revokeObjectURL(profilePic);
      }
      isMounted = false;
    };
  }, [user]);

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
          <div className="ms-auto">
            {user ? (
              <a className="nav-link" href="/dashboard">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="rounded-circle"
                    width="30"
                    height="30"
                  />
                ) : (
                  <span className="badge bg-secondary"></span>
                )}
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
