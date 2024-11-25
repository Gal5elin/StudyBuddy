import { useEffect, useState } from "react";
import { getProfilePic } from "../api/usersApi";

const Navbar = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      const picBlob = await getProfilePic(); // Should return a Blob or URL
      console.log(picBlob);
      const imageUrl = URL.createObjectURL(picBlob); // Convert Blob to image URL
      setProfilePic(imageUrl);
    };

    fetchProfilePic();
  }, []);

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
              {profilePic ? (
                <a className="nav-link" href="/dashboard">
                  <img
                    src={profilePic}
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
