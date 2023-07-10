import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";

import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/src/stylesheets/datepicker.scss";
import { Select, InputLabel, SelectChangeEvent, MenuItem } from "@mui/material";

import {
  REACT_SESSION,
  ITEM_FORMAT,
  LOCATION_CHOICES,
  CATEGORY_CHOICES,
} from "../constants";
import "./addItem.scss";

function AddItem() {
  let date = new Date();
  date.setDate(date.getDate() + 14);
  const [shared, setShared] = useState(false);
  const [category, setCategory] = useState(Object.keys(CATEGORY_CHOICES)[0]);
  const [location, setLocation] = useState(Object.keys(LOCATION_CHOICES)[0]);
  const [dateExpire, setDateExpire] = useState(date);
  const [issue, setIssue] = useState("");
  const [dateIssue, setDateIssue] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      quantity: 1,
      shared: false,
      note: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(64, "Name too long.").required(),
      quantity: Yup.number().min(1, "Invalid quantity").required(),
      note: Yup.string().max(255, "Note too long."),
    }),

    onSubmit: (values) => {
      fetch("/items", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          category: category,
          quantity: values.quantity,
          date_expire: dateExpire,
          location: location,
          shared: shared,
          note: values.note,
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

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      if (date >= new Date()) {
        setDateExpire(date);
        setDateIssue("");
      } else {
        setDateIssue("Invalid Date. Expiration has passed.");
      }
    } else {
      setDateIssue("");
    }
  };

  const handleSharedChange = () => {
    setShared(!shared);
  };

  useEffect(() => {
    if (!ReactSession.get(REACT_SESSION.loggedIn)) {
      window.location.href = "http://localhost:3000/login?next=%2Fitems";
    }
  }, []);

  return (
    <div className="items">
      <form onSubmit={formik.handleSubmit} className="items">
        <div className="form">
          <h1>Items</h1>
          <p className={"formIssue " + (issue && "active")}>{issue}</p>

          <div className="fields">
            <div className="field">
              <label>{ITEM_FORMAT[0].label}</label>
              <p
                className={
                  "issue " +
                  (formik.touched.name && formik.errors.name && "active")
                }
              >
                {formik.errors.name}
              </p>
              <input
                className={"input " + ITEM_FORMAT[0].type}
                type={ITEM_FORMAT[0].type}
                name={ITEM_FORMAT[0].name}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="field select">
              <InputLabel id={"label " + ITEM_FORMAT[1].type}>
                {ITEM_FORMAT[1].label}
              </InputLabel>
              <Select
                labelId={"label " + ITEM_FORMAT[1].type}
                id={"id " + ITEM_FORMAT[1].type}
                label={ITEM_FORMAT[1].name}
                value={category}
                sx={{ maxHeight: 40, minWidth: 120 }}
                onChange={handleCategoryChange}
              >
                {Object.keys(CATEGORY_CHOICES).map((key) => {
                  return (
                    <MenuItem key={key} value={key}>
                      {CATEGORY_CHOICES[key as keyof typeof CATEGORY_CHOICES]}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="field">
              <label>{ITEM_FORMAT[2].label}</label>
              <p
                className={
                  "issue " +
                  (formik.touched.quantity &&
                    formik.errors.quantity &&
                    "active")
                }
              >
                {formik.errors.quantity}
              </p>
              <input
                className={"input " + ITEM_FORMAT[2].type}
                type={ITEM_FORMAT[2].type}
                name={ITEM_FORMAT[2].name}
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="field">
              <label>{ITEM_FORMAT[3].label}</label>
              <p className={"issue " + (dateIssue && "active")}>{dateIssue}</p>
              <DatePicker
                className={"input " + ITEM_FORMAT[3].type}
                selected={dateExpire}
                dateFormat="yyyy-MM-dd"
                onChange={(date: Date | null) => handleDateChange(date)}
              />
            </div>

            <div className="field select">
              <InputLabel id={"label " + ITEM_FORMAT[4].type}>
                {ITEM_FORMAT[4].label}
              </InputLabel>
              <Select
                labelId={"label " + ITEM_FORMAT[4].type}
                id={"id " + ITEM_FORMAT[4].type}
                label={ITEM_FORMAT[4].name}
                value={location}
                sx={{ maxHeight: 40, minWidth: 120 }}
                onChange={handleLocationChange}
              >
                {Object.keys(LOCATION_CHOICES).map((key) => {
                  return (
                    <MenuItem key={key} value={key}>
                      {LOCATION_CHOICES[key as keyof typeof LOCATION_CHOICES]}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="field checkbox">
              <label>Shared</label>
              <input
                className={"input checkbox"}
                type="checkbox"
                checked={shared}
                onChange={handleSharedChange}
              />
            </div>

            <div className="field">
              <label>{ITEM_FORMAT[5].label}</label>
              <p
                className={
                  "issue " +
                  (formik.touched.note && formik.errors.note && "active")
                }
              >
                {formik.errors.note}
              </p>
              <textarea
                className={"input " + ITEM_FORMAT[5].type}
                name={ITEM_FORMAT[5].name}
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="button">
              <button disabled={!formik.isValid}>
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
