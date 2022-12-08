import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom';
import { ReactSession }  from 'react-client-session';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './itemsList.scss';
import {LOCATION_CHOICES, CATEGORY_CHOICES} from '../constants';
import { SxProps } from '@mui/material';

interface Item {
	name: string, 
	category: string,
	quantity: number,
	date_expire: Date,
	location: string,
	note: string
}

function ItemsList() {

	const [rows, setRows] = useState([]);
	const [deleteIssue, setDeleteIssue] = useState("");

	const COLUMNS = [
		"Name",
		"Qty",
		"Exp Date",
		"Location",
		"Category"
	]

	useEffect(() => {
		fetch("/items", {
			method: "get"
		}).then((response) => response.json())
		.then((responseJson) => {
			setRows(responseJson)
		})
	}, []);

	const handleUpdateClick = (item: Item) => {
		ReactSession.set("itemToEdit", item);
	};

	const handleDeleteClick = (item: Item) => {
		fetch(`/items/delete/${item['id' as keyof typeof item]}`, {
			method: "delete",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}).then((response) => {
			if (response.redirected) {
				console.log(response)
				window.location.href = response.url;
			} else {
				response.json().then((responseJson) => {
					setDeleteIssue(responseJson)
				})
			}
		})
	}


  return (
	<div className="items">
		<div className="actions">
			<Link onClick={() => {}} to=''>
				<span>
					Add Item
				</span>
			</Link>
		</div>
		<p className={'issue ' + (deleteIssue && "active")}>{deleteIssue}</p>
		<div className={"table_container "+ (rows.length && "active")}>
			<table className="table">
				<thead className="table_head">
					<tr className="top_row">
						<th>{ COLUMNS[0] }</th>
						<th>{ COLUMNS[1] }</th>
						<th>{ COLUMNS[2] }</th>
						<th>{ COLUMNS[3] }</th>
						<th>{ COLUMNS[4] }</th>
						{/* <th>Actions</th> */}
					</tr>
				</thead>
				<tbody className="table_body">
					{rows.map((row) => {
						return(
							<Fragment>
								<tr className="rows">
									<td className='primary_cell'>{ row['name'] }</td>
									<td className='primary_cell'>{ row['quantity'] }</td>
									<td className='primary_cell'>{ row['date_expire'] }</td>
									<td className='primary_cell'>{ LOCATION_CHOICES[row['location']] }</td>
									<td className='primary_cell'>{ CATEGORY_CHOICES[row['category']] }</td>
								</tr>
								<tr className="rows extra">
									<td colSpan={4} className='secondary_cell note'>{ row['note'] }</td>
									<td className='secondary_cell item_actions'>
										<Link onClick={() => handleUpdateClick(row)} to="update">Edit</Link> <Link onClick={() => handleDeleteClick(row)} to="">Delete</Link>
									</td>
								</tr>
							</Fragment>
						)
					})}
				</tbody>
			</table>
		</div>
		<div className={"empty " + (!rows.length && "active")}>
			<h1>No Items in List.<br />Add now!</h1>
		</div>
	</div>
  )
}

export default ItemsList