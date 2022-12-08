import React, { useEffect, useState } from "react";

import "./popup.scss";

interface PopupProps {
  handleYes: Function;
  handleNo: Function;
  issue: string;
  content: string;
}

const Popup = (props: PopupProps) => {
  const [res, setRes] = useState("");

  useEffect(() => {
    if (res === "yes") {
      props.handleYes();
    } else if (res === "no") {
      props.handleNo();
    }
  }, [res]);

  return (
    <div className="overlay">
      <div className="content">
        <button className="close" onClick={() => setRes("no")}>
          x
        </button>
        <div className="prompt">
          {props.issue && <p className="issue">{props.issue}</p>}
          <p className="prompt-txt">{props.content}</p>
        </div>
        <div className="response">
          <button className="btn yes" onClick={() => setRes("yes")}>
            Yes
          </button>
          <button className="btn no" onClick={() => setRes("no")}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
