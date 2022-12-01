import React from 'react'
import './navbar.scss';
import { Outlet, Link } from "react-router-dom";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  return (
	<>
		<div className="topbar">
			<div className="wrapper">
				<div className="left">
					<Link to='/items' className="logo">
						<span className="name">Food Inventory</span>
					</Link>
				</div>
				<div className="right">
					<Link to="/profile">
						<AccountCircleIcon className="icon"/>
					</Link>
					<Link to="/logout">
						<LogoutIcon className='icon'/>
					</Link>
				</div>
			</div>
		</div>

		<Outlet />
	</>
  )
}

export default Navbar;