import React from 'react'
import { Outlet } from 'react-router-dom';

import './profile.scss';

function Profile() {
  return (
	<div className="profile">
		<h1>Profile</h1>
		<Outlet />
	</div>
  )
}

export default Profile;