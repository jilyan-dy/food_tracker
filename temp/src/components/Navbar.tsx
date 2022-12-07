import React from 'react'
import { ReactSession }  from 'react-client-session';
import { Outlet, Link } from "react-router-dom";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import './navbar.scss';

function Navbar() {

	const handleLogoutClick = () => {
		fetch("/logout", {
			method: "post"
		}).then((response) => {
			if (response.redirected) {
				ReactSession.set("loggedIn", false);
				console.log(response)
				window.location.href = response.url;
			}
		})
	}
  return (
	<>
		<div className="navbar">
			<div className="wrapper">
				<div className="left">
					<Link to={(ReactSession.get("loggedIn") && '/items') || ((!ReactSession.get("loggedIn")) && '/')} className="logo">
						<span className="name">Food Inventory</span>
					</Link>
				</div>
				<div className={"right " + (ReactSession.get("loggedIn") && "active")}>
					<Link to="/profile">
						<AccountCircleIcon className="icon"/>
					</Link>
					<Link onClick={() => handleLogoutClick()} to="">
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