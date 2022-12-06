import React from 'react'
import { Outlet } from 'react-router-dom';

import './profile.scss';

function Profile() {
  return (
	<div className="profile">
		<Outlet />
	</div>
  )
}

export default Profile;