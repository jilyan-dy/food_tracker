import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

import "./updateProfile.scss";

YupPassword(Yup);

function EditProfile() {
  const [toEdit, setToEdit] = useState("email");
  const [issue, setIssue] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/profile/update", {
      method: "get",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setEmail(responseJson["email"]);
        setToEdit(ReactSession.get("toEdit"));
      });
  }, []);

  const formik_email = useFormik({
    initialValues: {
      email: email,
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
    }),

    onSubmit: (values) => {
      fetch("/profile/update", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          update: "email",
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

  const formik_password = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Required"),
      newPassword: Yup.string()
        .min(8, "must contain at least 8 characters")
        .minLowercase(1, "must contain at least 1 lower case character")
        .minUppercase(1, "must contain at least 1 upper case character")
        .minNumbers(1, "must contain at least 1 number")
        .minSymbols(1, "must contain at least 1 special character")
        .required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("newPassword"), null], "Password must match"),
    }),

    onSubmit: (values) => {
      fetch("/profile/update", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: values.oldPassword,
          newPassword: values.newPassword,
          update: "password",
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

  const inputs = [
    {
      id: 0,
      name: "email",
      type: "text",
      placeholder: "Enter your Email",
      label: "Email",
    },
    {
      id: 1,
      name: "password",
      type: "password",
      placeholder: "Enter your Password",
      label: "Password",
    },
    {
      id: 2,
      name: "oldPassword",
      type: "password",
      placeholder: "Enter your old Password",
      label: "Old Password",
    },
    {
      id: 3,
      name: "newPassword",
      type: "password",
      placeholder: "Enter your new Password",
      label: "New Password",
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Re-enter your Password",
      label: "Confirm Password",
    },
  ];

  return (
    <div className="details">
      <form onSubmit={formik_email.handleSubmit}>
        <div className={"form " + (toEdit === "email" && "active")}>
          <p className={"formIssue " + (issue && "active")}>{issue}</p>
          <div className="fields">
            <div className="field">
              <label>{inputs[0].label}</label>
              <p
                className={
                  "issue " +
                  (formik_email.touched.email &&
                    formik_email.errors.email &&
                    "active")
                }
              >
                {formik_email.errors.email}
              </p>
              <input
                className={inputs[0].name}
                type={inputs[0].type}
                name={inputs[0].name}
                value={formik_email.values.email}
                onChange={formik_email.handleChange}
                onBlur={formik_email.handleBlur}
              />
            </div>

            <div className="field">
              <label>{inputs[1].label}</label>
              <p
                className={
                  "issue " +
                  (formik_email.touched.password &&
                    formik_email.errors.password &&
                    "active")
                }
              >
                {formik_email.errors.password}
              </p>
              <input
                className={inputs[1].name}
                type={inputs[1].type}
                name={inputs[1].name}
                value={formik_email.values.password}
                onChange={formik_email.handleChange}
                onBlur={formik_email.handleBlur}
              />
            </div>
            <div className="button">
              <button disabled={!formik_email.isValid}>
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      <form onSubmit={formik_password.handleSubmit}>
        <div className={"form " + (toEdit === "password" && "active")}>
          <p className={"formIssue " + (issue && "active")}>{issue}</p>
          <div className="fields">
            <div className="field">
              <label>{inputs[2].label}</label>
              <p
                className={
                  "issue " +
                  (formik_password.touched.oldPassword &&
                    formik_password.errors.oldPassword &&
                    "active")
                }
              >
                {formik_password.errors.oldPassword}
              </p>
              <input
                className={inputs[2].name}
                type={inputs[2].type}
                name={inputs[2].name}
                value={formik_password.values.oldPassword}
                onChange={formik_password.handleChange}
                onBlur={formik_password.handleBlur}
              />
            </div>

            <div className="field">
              <label>{inputs[3].label}</label>
              <p
                className={
                  "issue " +
                  (formik_password.touched.newPassword &&
                    formik_password.errors.newPassword &&
                    "active")
                }
              >
                {formik_password.errors.newPassword}
              </p>
              <input
                className={inputs[3].name}
                type={inputs[3].type}
                name={inputs[3].name}
                value={formik_password.values.newPassword}
                onChange={formik_password.handleChange}
                onBlur={formik_password.handleBlur}
              />
            </div>

            <div className="field">
              <label>{inputs[4].label}</label>
              <p
                className={
                  "issue " +
                  (formik_password.touched.confirmPassword &&
                    formik_password.errors.confirmPassword &&
                    "active")
                }
              >
                {formik_password.errors.confirmPassword}
              </p>
              <input
                className={inputs[4].name}
                type={inputs[4].type}
                name={inputs[4].name}
                value={formik_password.values.confirmPassword}
                onChange={formik_password.handleChange}
                onBlur={formik_password.handleBlur}
              />
            </div>
            <div className="button">
              <button disabled={!formik_password.isValid}>
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
