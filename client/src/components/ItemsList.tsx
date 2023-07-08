import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from "react-client-session";

import {
  REACT_SESSION,
  LOCATION_CHOICES,
  CATEGORY_CHOICES,
} from "../constants";
import "./itemsList.scss";
import Popup from "./Popup";

interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  date_expire: Date;
  location: string;
  note: string;
}

function ItemsList() {
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState("-1");
  const [rows, setRows] = useState([]);
  const [deleteIssue, setDeleteIssue] = useState("");

  const COLUMNS = ["Name", "Qty", "Exp Date", "Location", "Category"];

  useEffect(() => {
    fetch("/items", {
      method: "get",
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          setRows(responseJson);
        });
      }
    });
  }, []);

  const handleUpdateClick = (item: Item) => {
    ReactSession.set(REACT_SESSION.editItem, item);
  };

  const handleDeleteClick = (item: string) => {
    setOpen(!open);
    setToDelete(item);
  };

  const handleNo = () => {
    setOpen(false);
  };

  const handleYes = () => {
    fetch(`/items/delete/${toDelete}`, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.redirected) {
        setOpen(false);
        console.log(response);
        window.location.href = response.url;
      } else {
        response.json().then((responseJson) => {
          setDeleteIssue(responseJson);
        });
      }
    });
  };

  return (
    <div className="items">
      <div className="actions">
        <Link to="add">
          <span>Add Item</span>
        </Link>
      </div>
      <div className={"table_container " + (rows.length && "active")}>
        <table className="table">
          <thead className="table_head">
            <tr className="top_row">
              <th>{COLUMNS[0]}</th>
              <th>{COLUMNS[1]}</th>
              <th>{COLUMNS[2]}</th>
              <th>{COLUMNS[3]}</th>
              <th>{COLUMNS[4]}</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody className="table_body">
            {rows.map((row) => {
              return (
                <Fragment key={row["id"]}>
                  <tr className="rows">
                    <td className="primary_cell">{row["name"]}</td>
                    <td className="primary_cell">{row["quantity"]}</td>
                    <td className="primary_cell">{row["date_expire"]}</td>
                    <td className="primary_cell">
                      {LOCATION_CHOICES[row["location"]]}
                    </td>
                    <td className="primary_cell">
                      {CATEGORY_CHOICES[row["category"]]}
                    </td>
                  </tr>
                  <tr className="rows extra">
                    <td colSpan={4} className="secondary_cell note">
                      {row["note"]}
                    </td>
                    <td className="secondary_cell item_actions">
                      <Link onClick={() => handleUpdateClick(row)} to="update">
                        Edit
                      </Link>{" "}
                      <Link onClick={() => handleDeleteClick(row["id"])} to="">
                        Delete
                      </Link>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={"empty " + (!rows.length && "active")}>
        <h1>
          No Items in List.
          <br />
          Add now!
        </h1>
      </div>
      {open && (
        <Popup
          handleNo={handleNo}
          handleYes={handleYes}
          issue={deleteIssue}
          content="Are you sure you want to delete this item?"
        />
      )}
    </div>
  );
}

export default ItemsList;
