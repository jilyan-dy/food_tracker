import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./house.scss";
import CreateHouse from "../components/CreateHouse";
import JoinHouse from "../components/JoinHouse";
import ViewHouse from "../components/ViewHouse";

interface Values {
  house_name: String;
  admin: Boolean;
  members: [];
}

function House() {
  const [hasHouse, setHasHouse] = useState(true);
  const [joinHouse, setJoinHouse] = useState(true);
  const [options, setOptions] = useState([]);
  const [values, setValues] = useState<Values>({
    house_name: "",
    admin: false,
    members: [],
  });

  const viewHouseProps = {
    setHasHouse: setHasHouse,
    setJoinHouse: setJoinHouse,
    values: values,
  };

  useEffect(() => {
    fetch("/api/house", {
      method: "get",
    }).then((response) => {
      console.log(values["house_name"]);
      if (response.redirected) {
        window.location.href = response.url;
      } else if (response.status === 209) {
        setHasHouse(false);
        response.json().then((responseJson) => {
          setOptions(responseJson);
          console.log(responseJson);
          console.log(typeof responseJson);
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

  return (
    <div className="household">
      {hasHouse && <ViewHouse {...viewHouseProps} />}
      {!hasHouse && (
        <div className="popup">
          <div className="content">
            <button
              className="close"
              onClick={() => {
                values["house_name"].length > 0
                  ? setHasHouse(true)
                  : setHasHouse(false);
              }}
            >
              x
            </button>
            <div className="add-house-actions">
              <Link
                onClick={() => {
                  values["house_name"].length > 0
                    ? setJoinHouse(false)
                    : setJoinHouse(true);
                }}
                to=""
              >
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
              {joinHouse && <JoinHouse {...options} />}
              {!joinHouse && <CreateHouse />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default House;
