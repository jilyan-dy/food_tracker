import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./viewHouse.scss";

interface PopupProps {
  handleYes: Function;
  handleNo: Function;
  issue: string;
  content: string;
}

const CreateHouse = () => {
  const [issue, setIssue] = useState("");

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

  return (
    <div className="house create">
      <form onSubmit={formik_create.handleSubmit}>
        <div className="form">
          <p className={"formIssue " + (issue && "active")}>{issue}</p>
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
  );
};

export default CreateHouse;
