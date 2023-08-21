import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

import "./register.scss";

YupPassword(Yup);

const Register = () => {
  const [issue, setIssue] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(20, "Must be 20 characters or less.")
        .required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(8, "must contain at least 8 characters")
        .minLowercase(1, "must contain at least 1 lower case character")
        .minUppercase(1, "must contain at least 1 upper case character")
        .minNumbers(1, "must contain at least 1 number")
        .minSymbols(1, "must contain at least 1 special character")
        .required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Password must match"),
    }),

    onSubmit: (values) => {
      // console.log(values);
      fetch("/api/register", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
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
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Enter your Username",
      label: "Username",
    },
    {
      id: 2,
      name: "email",
      type: "text",
      placeholder: "Enter your Email",
      label: "Email",
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Enter your Password",
      label: "Password",
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
    <form onSubmit={formik.handleSubmit} className="register">
      <div className="form">
        <p className={"formIssue " + (issue && "active")}>{issue}</p>

        <div className="fields">
          <div className="field">
            <label>{inputs[0].label}</label>
            <p
              className={
                "issue " +
                (formik.touched.username && formik.errors.username && "active")
              }
            >
              {formik.errors.username}
            </p>
            <input
              className={inputs[0].name}
              type={inputs[0].type}
              name={inputs[0].name}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="field">
            <label>{inputs[1].label}</label>
            <p
              className={
                "issue " +
                (formik.touched.email && formik.errors.email && "active")
              }
            >
              {formik.errors.email}
            </p>
            <input
              className={inputs[1].name}
              type={inputs[1].type}
              name={inputs[1].name}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="field">
            <label>{inputs[2].label}</label>
            <p
              className={
                "issue " +
                (formik.touched.password && formik.errors.password && "active")
              }
            >
              {formik.errors.password}
            </p>
            <input
              className={inputs[2].name}
              type={inputs[2].type}
              name={inputs[2].name}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="field">
            <label>{inputs[3].label}</label>
            <p
              className={
                "issue " +
                (formik.touched.confirmPassword &&
                  formik.errors.confirmPassword &&
                  "active")
              }
            >
              {formik.errors.confirmPassword}
            </p>
            <input
              className={inputs[3].name}
              type={inputs[3].type}
              name={inputs[3].name}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="button">
            <button disabled={!formik.isValid}>
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
