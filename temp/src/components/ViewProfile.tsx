import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from "react-client-session";

import VerifiedIcon from "@mui/icons-material/Verified";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

import "./viewProfile.scss";
import Popup from "./Popup";

interface Values {
  username: String;
  email: String;
  date_added: String;
  admin: boolean;
}

function ViewProfile() {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [values, setValues] = useState<Values>({
    username: "",
    email: "",
    date_added: "",
    admin: false,
  });

  const handleNo = () => {
    setOpen(false);
  };

  const handleYes = () => {
    fetch("/profile/delete").then((response) => {
      if (response.redirected) {
        setOpen(false);
        ReactSession.set("loggedIn", false);
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          console.log(responseJson["issue"]);
          setIssue(responseJson["issue"]);
        });
      }
    });
  };

  useEffect(() => {
    fetch("/profile", {
      method: "get",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setValues({
          username: responseJson["username"],
          email: responseJson["email"],
          date_added: responseJson["date_added"],
          admin: responseJson["admin"],
        });
      });
  }, []);

  const handleLinkClick = (action: string) => {
    ReactSession.set("toEdit", action);
  };

  return (
    <>
      <div className="details">
        <div className="label">
          <label>Username : </label>
          <br />
          <label>Email : </label>
          <br />
          <label>Date Registered : </label>
          <br />
          <label>Admin Access : </label>
        </div>
        <div className="value">
          <span>{values["username"]}</span>
          <br />
          <span>{values["email"]}</span>
          <br />
          <span>{values["date_added"]}</span>
          <br />
          <span>
            {values["admin"] ? <VerifiedIcon /> : <DoNotDisturbIcon />}
          </span>
        </div>
      </div>
      <div className="actions">
        <Link onClick={() => handleLinkClick("email")} to="update">
          <span>Change Email</span>
        </Link>
        <Link onClick={() => handleLinkClick("password")} to="update">
          <span>Change Password</span>
        </Link>
        <Link onClick={() => setOpen((o) => !o)} to="">
          <span>Delete Account</span>
        </Link>
      </div>
      {open && (
        <Popup
          handleNo={handleNo}
          handleYes={handleYes}
          issue={issue}
          content="Are you sure you want to delete your account?"
        />
      )}
    </>
  );
}

export default ViewProfile;
