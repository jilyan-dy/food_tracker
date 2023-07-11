import React, { useState } from "react";
import { useFormik } from "formik";
import { Select, SelectChangeEvent, MenuItem, InputLabel } from "@mui/material";

import "./viewHouse.scss";

interface JSONObject {
  [x: number]: String;
}

const JoinHouse = (options: JSONObject) => {
  const [issue, setIssue] = useState("");
  const [house, setHouse] = useState("");

  const handleHouseChange = (event: SelectChangeEvent) => {
    setHouse(event.target.value as string);
  };

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

  return (
    <div className="house join">
      <form onSubmit={formik_join.handleSubmit}>
        <div className="form">
          <p className={"formIssue " + (issue && "active")}>{issue}</p>
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
  );
};

export default JoinHouse;
