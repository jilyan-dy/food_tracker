import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ReactSession }  from 'react-client-session';

interface Values {
  username: String,
  email: String,
  date_added: String,
  admin: boolean,
}

function ViewProfile() {
	const [values, setValues] = useState<Values>({
	  username: "",
	  email: "",
	  date_added: "",
	  admin: false,
	});

	useEffect(() => {
		fetch("/profile", {
			method: "get"
		}).then((response) => response.json()
		.then((responseJson) => {
			setValues({
				'username': responseJson['username'],
				'email': responseJson['email'],
				'date_added': responseJson['date_added'],
				'admin': responseJson['admin']
			})
		})
		)
	}, []);

	const handleLinkClick = (action: string) => {
		ReactSession.set("toEdit", action);
	};

  return (
	<div className="details">
		<label>Username: </label>
		<span>{ values['username'] }</span>
		<br/>

		<label>Email: </label>
		<span>{ values['email'] }</span>
		<br/>
		
		<label>Date Registered: </label>
		<span>{ values['date_added'] }</span>
		<br/>
		
		<label>Admin Access: </label>
		<span>{ values['admin'] ? '/' : 'x' }</span>
		<br />

		<Link onClick={() => handleLinkClick('email')} to='/profile/update'>Change Email</Link>
		<Link onClick={() => handleLinkClick('password')} to='/profile/delete'>Change Password</Link>
		<button>Delete Account</button>

	</div>
  )
}

export default ViewProfile