import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import './login.scss';

function Login() {

	const [issue, setIssue] = useState('');

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		validationSchema: Yup.object({
			username: Yup.string()
				.required("Required"),
			password: Yup.string()
				.required("Required"),
		}),
	
		onSubmit: (values) => {
			fetch("/login", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify({
					username: values.username,
					password: values.password
				})
			}).then((response) => {
				if (response.redirected) {
					console.log(response)
					window.location.href = response.url;
				} else {
					response.json().then((responseJson) => {
						console.log(responseJson['issue'])
						setIssue(responseJson['issue'])
					})
				}
			})
		},
	  });
	
	  const inputs = [
		{
		  id: 1,
		  name: "username",
		  type: "text",
		  placeholder: "Enter your Username",
		  label: "Username",
		},
		{
		  id: 2,
		  name: "password",
		  type: "password",
		  placeholder: "Enter your Password",
		  label: "Password",
		}
	  ]
	  
	  return (
		<div className='login'>
		  <form onSubmit={formik.handleSubmit} className="login">
			<div>
			  <h1>Login</h1>
			  <p>{issue ? issue : ''}</p>
			  <div className="fields">
				<div className="field">
				  <label>{ inputs[0].label }</label>
				  <p>{formik.touched.username && formik.errors.username ? formik.errors.username : ''}</p>
				  <input 
					className={inputs[0].name}
					type={inputs[0].type}
					name={inputs[0].name}
					value={formik.values.username}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
				  />
				</div>
	
				<div className="field">
				  <label>{ inputs[1].label }</label>
				  <p>{formik.touched.password && formik.errors.password ? formik.errors.password : ''}</p>
				  <input 
					className={inputs[1].name}
					type={inputs[1].type}
					name={inputs[1].name}
					value={formik.values.password}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
				  />
				</div>
	
				<button>Login</button>
			  </div>
			</div>
		  </form>
		</div>
	  )
	}

export default Login;