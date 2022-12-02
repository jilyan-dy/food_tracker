import React, { useState } from 'react'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/src/stylesheets/datepicker.scss";

import './itemsList.scss';

function AddItem() {
	const CATEGORY_CHOICES = ["Perishable", "Non Perishable", "Condiments"]
	const LOCATION_CHOICES = ["Freezer", "Fridge", "Kitchen", "Cabinet"]
	const [issue, setIssue] = useState('');
	let date = new Date();
	date.setDate(date.getDate() + 14)

	const formik = useFormik({
		initialValues: {
			name: "",
			category: CATEGORY_CHOICES[0],
			quantity: 1,
			date_expire: date,
			location: LOCATION_CHOICES[0],
			note: "",
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.max(64, "Name too long.")
				.required(),
			category: Yup.string()
				.oneOf(CATEGORY_CHOICES, "Invalid category")
				.required(),
			quantity: Yup.number()
				.min(1, "Invalid quantity")
				.required(),
			date_expire: Yup.date()
				.min(new Date())
				.required(),
			location: Yup.string()
			.oneOf(LOCATION_CHOICES, "Invalid category")
			.required(),
			note: Yup.string()
				.max(255, "Note too long.")
		}),
	
		onSubmit: (values) => {
			fetch("/items", {
				method: "post",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify({
					name: values.name,
					category: values.category,
					quantity: values.quantity,
					date_expire: values.date_expire,
					location: values.location,
					note: values.note,
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
		  name: "name",
		  type: "text",
		  placeholder: "Enter item name",
		  label: "Name",
		},
		{
		  id: 2,
		  name: "category",
		  type: "text",
		  placeholder: CATEGORY_CHOICES[0],
		  label: "Category",
		},
		{
		  id: 3,
		  name: "quantity",
		  type: "number",
		  placeholder: "1",
		  label: "Quantity",
		},
		{
		  id: 4,
		  name: "date_expire",
		  type: "date",
		  placeholder: "",
		  label: "Expiration Date",
		},
		{
		  id: 5,
		  name: "location",
		  type: "text",
		  placeholder: LOCATION_CHOICES[0],
		  label: "Location",
		},
		{
		  id: 6,
		  name: "note",
		  type: "text",
		  placeholder: "Enter item note",
		  label: "Note",
		}
	  ]

  return (
	<div className="items">
		<form onSubmit={formik.handleSubmit} className="items">
		<div>
			<h1>Items</h1>
			<p>{issue ? issue : ''}</p>
			<div className="fields">
				<div className="field">
					<label>{inputs[0].label}</label>
					<p>{formik.touched.name && formik.errors.name ? formik.errors.name : ''}</p>
					<input 
					className={inputs[0].name}
					type={inputs[0].type}
					name={inputs[0].name}
					value={formik.values.name}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					/>
				</div>

				<div className="field">
					<label>{ inputs[1].label }</label>
					<p>{formik.touched.category && formik.errors.category ? formik.errors.category : ''}</p>
					<select value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}>
						{CATEGORY_CHOICES.map((choice) => (
							<option key={choice} value={choice}>{choice}</option>
						))}
					</select>
				</div>

				<div className="field">
					<label>{inputs[2].label}</label>
					<p>{formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : ''}</p>
					<input 
					className={inputs[2].name}
					type={inputs[2].type}
					name={inputs[2].name}
					value={formik.values.quantity}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					/>
				</div>

				<div className="field">
					<label>{inputs[3].label}</label>
					<p>{formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : ''}</p>
					<DatePicker dateFormat="yyyy-MM-dd" selected={formik.values.date_expire} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
				</div>

				<div className="field">
					<label>{ inputs[4].label }</label>
					<p>{formik.touched.location && formik.errors.location ? formik.errors.location : ''}</p>
					<select value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur}>
						{LOCATION_CHOICES.map((choice) => (
							<option key={choice} value={choice}>{choice}</option>
						))}
					</select>
				</div>

				<div className="field">
					<label>{ inputs[5].label }</label>
					<p>{formik.touched.note && formik.errors.note ? formik.errors.note : ''}</p>
					<textarea value={formik.values.note} onChange={formik.handleChange} onBlur={formik.handleBlur} />
				</div>

				<button>Add Item</button>
			</div>
		</div>
		</form>
	</div>
  )
}

export default AddItem;