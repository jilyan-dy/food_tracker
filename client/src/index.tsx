import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactSession } from "react-client-session";

import "./index.scss";

import Navbar from "./components/Navbar";
import App from "./pages/App";
import Items from "./pages/Items";
import ItemsList from "./components/ItemsList";
import AddItem from "./components/AddItem";
import UpdateItem from "./components/UpdateItem";
import Profile from "./pages/Profile";
import ViewProfile from "./components/ViewProfile";
import EditProfile from "./components/updateProfile";
import House from "./pages/House";
// import ViewHouse from "./components/ViewHouse";

export default function Index() {
  ReactSession.setStoreType("localStorage");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/" element={<Navbar />}>
          <Route path="profile" element={<Profile />}>
            <Route index element={<ViewProfile />} />
            <Route path="update" element={<EditProfile />} />
            <Route path="*" element={<App />} />
          </Route>
          <Route path="items" element={<Items />}>
            <Route index element={<ItemsList />} />
            <Route path="add" element={<AddItem />} />
            <Route path="update" element={<UpdateItem />} />
          </Route>
          <Route path="house" element={<House />}>
            {/* <Route index element={<ViewHouse />} /> */}
            {/* <Route path="update" element={<EditHouse />} /> */}
          </Route>

          <Route path="*" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Index />);
