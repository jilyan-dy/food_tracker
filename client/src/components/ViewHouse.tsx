import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";

import Add from "@mui/icons-material/AddCircleOutline";
import Delete from "@mui/icons-material/HighlightOff";
import Leave from "@mui/icons-material/ExitToApp";
import VerifiedIcon from "@mui/icons-material/Verified";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import "./viewHouse.scss";

interface Values {
  house_name: String;
  admin: Boolean;
  members: [];
}

interface Props {
  setHasHouse: React.Dispatch<React.SetStateAction<boolean>>;
  setJoinHouse: React.Dispatch<React.SetStateAction<boolean>>;
  values: Values;
}

const ViewHouse = (props: Props) => {
  const { setHasHouse, setJoinHouse, values } = props;
  const [issue, setIssue] = useState("");

  const handleCreateClick = () => {
    setHasHouse(false);
    setJoinHouse(false);
  };

  const handleDeleteClick = () => {
    fetch("/api/house/delete").then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          console.log(responseJson["issue"]);
          setIssue(responseJson["issue"]);
        });
      }
    });
  };

  const handleLeaveClick = () => {
    fetch("/api/house/leave", {
      method: "post",
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          console.log(responseJson["issue"]);
          setIssue(responseJson["issue"]);
        });
      }
    });
  };

  const handleAdminAdd = (memberId: string) => {
    fetch("/api/admin/add", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId: memberId,
      }),
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          console.log(responseJson["issue"]);
          setIssue(responseJson["issue"]);
        });
      }
    });
  };

  const handleAdminRemove = (memberId: string) => {
    fetch("/api/admin/remove", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId: memberId,
      }),
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          console.log(responseJson["issue"]);
          setIssue(responseJson["issue"]);
        });
      }
    });
  };

  const handleVerifyClick = (memberId: string) => {
    fetch("/api/house/verify", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId: memberId,
      }),
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          console.log(responseJson["issue"]);
          setIssue(responseJson["issue"]);
        });
      }
    });
  };

  return (
    <div className="has-house">
      <h1>House Details</h1>
      <p className={"issue " + (issue && "active")}>{issue}</p>
      <div className="house-actions">
        {values["admin"] && (
          <Link onClick={() => handleDeleteClick()} to="" className="action">
            <Delete className="icon" />
            <label>Delete</label>
          </Link>
        )}
        <Link onClick={() => handleLeaveClick()} to="" className="action">
          <Leave className="icon" />
          <label>Leave</label>
        </Link>
        <Link onClick={() => handleCreateClick()} to="" className="action">
          <Add className="icon" />
          <label>Create</label>
        </Link>
      </div>
      <div className="details">
        <div className="label">
          <label>Name : </label>
          <label>Members : </label>
        </div>
        <div className="value">
          <span>{values["house_name"]}</span>
          <div className={"table_container"}>
            <table className="table">
              <thead className="table_head">
                <tr className="top_row">
                  <th>Name</th>
                  <th className="bool">Admin</th>
                  <th className="bool">Verified</th>
                </tr>
              </thead>
              <tbody className="table_body">
                {values["members"].map((member) => {
                  return (
                    <Fragment key={member["id"]}>
                      <tr className="rows">
                        <td className="primary">{member["username"]}</td>
                        <td className="primary bool">
                          {member["admin"] ? (
                            values["admin"] ? (
                              <Link
                                onClick={() => handleAdminRemove(member["id"])}
                                to=""
                                className="admin"
                              >
                                <VerifiedIcon />
                              </Link>
                            ) : (
                              <DoNotDisturbIcon />
                            )
                          ) : values["admin"] ? (
                            <Link
                              onClick={() => handleAdminAdd(member["id"])}
                              to=""
                              className="not-admin"
                            >
                              <DoNotDisturbIcon />
                            </Link>
                          ) : (
                            <DoNotDisturbIcon />
                          )}
                        </td>
                        <td className="primary bool">
                          {member["verified"] ? (
                            <VerifiedIcon />
                          ) : values["admin"] ? (
                            <Link
                              onClick={() => handleVerifyClick(member["id"])}
                              to=""
                              className="verify"
                            >
                              <DoNotDisturbIcon />
                            </Link>
                          ) : (
                            <DoNotDisturbIcon />
                          )}
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHouse;
