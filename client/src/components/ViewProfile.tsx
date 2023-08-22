import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from "react-client-session";

import VerifiedIcon from "@mui/icons-material/Verified";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

import { REACT_SESSION } from "../constants";
import Popup from "./Popup";
import "./viewProfile.scss";

interface Values {
  username: String;
  email: String;
  date_added: String;
  admin: boolean;
  verified: boolean;
  house: String;
}

function ViewProfile() {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [values, setValues] = useState<Values>({
    username: "",
    email: "",
    date_added: "",
    admin: false,
    verified: false,
    house: "",
  });

  const handleNo = () => {
    setOpen(false);
  };

  const handleYes = () => {
    fetch("/api/profile", {
      method: "delete",
    }).then((response) => {
      if (response.redirected) {
        setOpen(false);
        ReactSession.set(REACT_SESSION.loggedIn, false);
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
    fetch("/api/profile", {
      method: "get",
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          setValues({
            username: responseJson["username"],
            email: responseJson["email"],
            date_added: responseJson["date_added"],
            admin: responseJson["admin"],
            verified: responseJson["verified"],
            house: responseJson["house"],
          });
        });
      }
    });
  }, []);

  const handleLinkClick = (action: string) => {
    ReactSession.set(REACT_SESSION.editProfile, action);
  };

  return (
    <div className="outer">
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
      <span className="line"></span>
      <div className="details">
        <div className="header">
          <span className="name">{values["username"]}</span>
          {values["verified"] ? <VerifiedIcon /> : <DoNotDisturbIcon />}
        </div>
        <div className="detail">
          <label className="label">Email</label>
          <span className="value">{values["email"]}</span>
        </div>
        <div className="detail">
          <label className="label">House</label>
          <span className="value">{values["house"]}</span>
        </div>
        <div className="detail">
          <label className="label">Admin</label>
          <span className="value">
            {values["admin"] ? <VerifiedIcon /> : <DoNotDisturbIcon />}
          </span>
        </div>
        <div className="detail">
          <label className="label">Since</label>
          <span className="value">{values["date_added"]}</span>
        </div>
      </div>
      {open && (
        <Popup
          handleNo={handleNo}
          handleYes={handleYes}
          issue={issue}
          content="Are you sure you want to delete your account?"
        />
      )}
    </div>
  );
}

export default ViewProfile;
