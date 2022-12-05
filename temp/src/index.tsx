import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactSession }  from 'react-client-session';

import './index.scss';

import Navbar from './components/Navbar';
import App from './pages/App';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Items from './pages/Items';
import ItemsList from './components/ItemsList';
import AddItem from './components/AddItem';
import UpdateItem from './components/UpdateItem';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import DeleteProfile from './components/DeleteProfile';

export default function Index() {
  ReactSession.setStoreType("localStorage");
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navbar />}>
          <Route index element={<App />} />
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
          <Route path='logout' element={<Logout />} />
          <Route path='profile' element={<Profile />}>
            <Route index element={<ViewProfile />} />
            <Route path='update' element={<EditProfile />} />
            <Route path='delete' element={<DeleteProfile />} />
            <Route path='*' element={<App />} />
          </Route>
          <Route path='items' element={<Items />}>
            <Route index element={<ItemsList />} />
            <Route path='add' element={<AddItem />} />
            <Route path='update' element={<UpdateItem />} />
          </Route>
          
          <Route path='*' element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Index />);
