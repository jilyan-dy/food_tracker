import React from 'react'
import './navbar.scss';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  return (
	<div className="topbar">
		<div className="wrapper">
			<div className="left">
				<a href='/items' className="logo">
					<span className="name">Food Inventory</span>
				</a>
			</div>
			<div className="right">
				<a href="/profile">
					<AccountCircleIcon className="icon"/>
				</a>
				<a href="/logout">
					<LogoutIcon className='icon'/>
				</a>
			</div>
		</div>
	</div>
  )
}

export default Navbar;