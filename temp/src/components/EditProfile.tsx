import React, { useEffect, useState } from 'react';
import { ReactSession }  from 'react-client-session';

interface Values {
  username: String,
  email: String,
  date_added: String,
  admin: boolean,
}

function EditProfile() {
	const [toEdit, setToEdit] = useState("email")
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
			console.log(responseJson['username'])
			setValues({
				'username': responseJson['username'],
				'email': responseJson['email'],
				'date_added': responseJson['date_added'],
				'admin': responseJson['admin']
			})
			setToEdit(ReactSession.get("toEdit"))
		})
		)
	}, []);

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

	</div>
  )
}

export default EditProfile