import React, { useEffect, useState, Fragment } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Select, SelectChangeEvent, MenuItem, InputLabel } from "@mui/material";

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

function ViewHouse() {
  const [house, setHouse] = useState("");
  const [hasHouse, setHasHouse] = useState(true);
  const [joinHouse, setJoinHouse] = useState(true);
  const [options, setOptions] = useState([]);
  const [issue, setIssue] = useState("");
  const [values, setValues] = useState<Values>({
    house_name: "",
    admin: false,
    members: [],
  });

  useEffect(() => {
    fetch("/house", {
      method: "get",
    }).then((response) => {
      console.log(values["house_name"]);
      if (response.redirected) {
        window.location.href = response.url;
      } else if (response.status === 209) {
        setHasHouse(false);
        response.json().then((responseJson) => {
          setOptions(responseJson);
        });
      } else {
        response.json().then((responseJson) => {
          setValues({
            house_name: responseJson["house_name"],
            admin: responseJson["admin"],
            members: responseJson["members"],
          });
        });
      }
    });
  }, []);

  const formik_join = useFormik({
    initialValues: {},

    onSubmit: () => {
      fetch("/house/join", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          house: house,
        }),
      }).then((response) => {
        if (response.redirected) {
          console.log(response);
          window.location.href = response.url;
        } else {
          response.json().then((responseJson) => {
            console.log(responseJson["issue"]);
            setIssue(responseJson["issue"]);
          });
        }
      });
    },
  });

  const handleHouseChange = (event: SelectChangeEvent) => {
    setHouse(event.target.value as string);
  };

  const formik_create = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(64, "Name too long.").required(),
    }),

    onSubmit: (values) => {
      fetch("/house/add", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
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
    },
  });

  const handleDeleteClick = () => {
    fetch("/house/delete").then((response) => {
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
    fetch("/house/leave", {
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

  const handleCreateClick = () => {
    setHasHouse(false);
    setJoinHouse(false);
  };

  return (
    <div className="household">
      {hasHouse && (
        <div className="has-house">
          <h1>House Details</h1>
          <p className={"issue " + (issue && "active")}>{issue}</p>
          <div className="house-actions">
            {values["admin"] && (
              <Link
                onClick={() => handleDeleteClick()}
                to=""
                className="action"
              >
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
                                <VerifiedIcon />
                              ) : (
                                <DoNotDisturbIcon />
                              )}
                            </td>
                            <td className="primary bool">
                              {member["verified"] ? (
                                <VerifiedIcon />
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
      )}
      {!hasHouse && (
        <div className="popup">
          <div className="content">
            <button className="close" onClick={() => console.log("hi")}>
              x
            </button>
            <div className="add-house-actions">
              <Link onClick={() => setJoinHouse(true)} to="">
                <span className={"action " + (joinHouse && "active")}>
                  Join
                </span>
              </Link>
              <Link onClick={() => setJoinHouse(false)} to="">
                <span className={"action " + (!joinHouse && "active")}>
                  Create
                </span>
              </Link>
            </div>
            <div className="forms">
              {joinHouse && (
                <div className="house join">
                  <form onSubmit={formik_join.handleSubmit}>
                    <div className="form">
                      <p className={"formIssue " + (issue && "active")}>
                        {issue}
                      </p>
                      <div className="fields">
                        <div className="field">
                          <InputLabel className={"label dropdown"}>
                            {"Select House"}
                          </InputLabel>
                          <Select
                            labelId={"label dropdown"}
                            id={"id dropdown"}
                            label={"House"}
                            value={house}
                            sx={{ maxHeight: 40, minWidth: 120 }}
                            onChange={handleHouseChange}
                            style={{ width: "60%" }}
                          >
                            {Object.keys(options).map((option) => {
                              return (
                                <MenuItem key={option} value={option}>
                                  {options[parseInt(option)]}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </div>

                        <div className="button">
                          <button disabled={!formik_join.isValid}>
                            <span>Join</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              {!joinHouse && (
                <div className="house create">
                  <form onSubmit={formik_create.handleSubmit}>
                    <div className="form">
                      <p className={"formIssue " + (issue && "active")}>
                        {issue}
                      </p>
                      <div className="fields">
                        <p
                          className={
                            "issue " +
                            (formik_create.touched.name &&
                              formik_create.errors.name &&
                              "active")
                          }
                        >
                          {formik_create.errors.name}
                        </p>
                        <div className="field">
                          <label className={"label text"}>{"Name"}</label>
                          <input
                            className={"input text"}
                            type={"text"}
                            name={"name"}
                            value={formik_create.values.name}
                            onChange={formik_create.handleChange}
                            onBlur={formik_create.handleBlur}
                          />
                        </div>

                        <div className="button">
                          <button disabled={!formik_create.isValid}>
                            <span>Create</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewHouse;
