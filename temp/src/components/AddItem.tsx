import React, { useState } from 'react'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/src/stylesheets/datepicker.scss";

import './itemsList.scss';
import {ITEM_FORMAT, LOCATION_CHOICES, CATEGORY_CHOICES} from '../constants';

function AddItem() {
	let date = new Date();
	date.setDate(date.getDate() + 14)
	const [dateExpire, setDateExpire] = useState(date);
	const [issue, setIssue] = useState('');
	const [dateIssue, setDateIssue] = useState('');

	const formik = useFormik({
		initialValues: {
			name: "",
			category: "",
			quantity: 1,
			location: "",
			note: "",
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.max(64, "Name too long.")
				.required(),
			category: Yup.string(),
			quantity: Yup.number()
				.min(1, "Invalid quantity")
				.required(),
			location: Yup.string(),
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
					date_expire: dateExpire,
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

	  const handleDateChange = (date: Date|null) => {
		if(date !== null){
			if(date >= (new Date())){
				setDateExpire(date);
				setDateIssue('');
			} else {
				setDateIssue('Invalid Date. Expiration has passed.');
			}
		} else {
			setDateIssue('')
		}
	  }

  return (
	<div className="items">
		<form onSubmit={formik.handleSubmit} className="items">
		<div>
			<h1>Items</h1>
			<p>{issue ? issue : ''}</p>
			<div className="fields">
				<div className="field">
					<label>{ITEM_FORMAT[0].label}</label>
					<p>{formik.touched.name && formik.errors.name ? formik.errors.name : ''}</p>
					<input 
					className={ITEM_FORMAT[0].name}
					type={ITEM_FORMAT[0].type}
					name={ITEM_FORMAT[0].name}
					value={formik.values.name}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					/>
				</div>

				<div className="field">
					<label>{ ITEM_FORMAT[1].label }</label>
					<p>{formik.touched.category && formik.errors.category ? formik.errors.category : ''}</p>
					<select className={ITEM_FORMAT[1].name} name={ITEM_FORMAT[1].name} value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}>
						{Object.keys(CATEGORY_CHOICES).map((key) => {
							return(
								<option key={key} value={key}>{CATEGORY_CHOICES[key as keyof typeof CATEGORY_CHOICES]}</option>
							)
						})}
					</select>
				</div>

				<div className="field">
					<label>{ITEM_FORMAT[2].label}</label>
					<p>{formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : ''}</p>
					<input 
					className={ITEM_FORMAT[2].name}
					type={ITEM_FORMAT[2].type}
					name={ITEM_FORMAT[2].name}
					value={formik.values.quantity}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					/>
				</div>

				<div className="field">
					<label>{ITEM_FORMAT[3].label}</label>
					<p>{dateIssue}</p>
					<DatePicker selected={dateExpire} dateFormat="yyyy-MM-dd" onChange={(date: Date|null) => handleDateChange(date)}/>
				</div>

				<div className="field">
					<label>{ ITEM_FORMAT[4].label }</label>
					<p>{formik.touched.location && formik.errors.location ? formik.errors.location : ''}</p>
					<select className={ITEM_FORMAT[4].name} name={ITEM_FORMAT[4].name} value={formik.values.location} onChange={formik.handleChange} onBlur={formik.handleBlur}>
						{Object.keys(LOCATION_CHOICES).map((key) => {
							return(
								<option key={key} value={key}>{LOCATION_CHOICES[key as keyof typeof LOCATION_CHOICES]}</option>
							)
						})}
					</select>
				</div>

				<div className="field">
					<label>{ ITEM_FORMAT[5].label }</label>
					<p>{formik.touched.note && formik.errors.note ? formik.errors.note : ''}</p>
					<textarea className={ITEM_FORMAT[5].name} name={ITEM_FORMAT[5].name} value={formik.values.note} onChange={formik.handleChange} onBlur={formik.handleBlur} />
				</div>

				<button disabled={!formik.isValid}>Add Item</button>
			</div>
		</div>
		</form>
	</div>
  )
}

export default AddItem;