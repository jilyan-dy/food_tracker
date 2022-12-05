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
		<p>{deleteIssue}</p>
		<TableContainer component={Paper}>
			<Table className='table' key="items_table">
				<TableHead key="table_head">
					<TableRow key="top_row">
						<TableCell>{ COLUMNS[0] }</TableCell>
						<TableCell>{ COLUMNS[1] }</TableCell>
						<TableCell>{ COLUMNS[2] }</TableCell>
						<TableCell>{ COLUMNS[3] }</TableCell>
						<TableCell>{ COLUMNS[4] }</TableCell>
						<TableCell> Actions </TableCell>
					</TableRow>
				</TableHead>
				<TableBody key="table_body">
					{rows.map((row) => {
						return(
							<Fragment key={row['id']}>
								<TableRow key={row['id']+"_row"}>
									<TableCell key={row['id']+"_cell_name"}>{ row['name'] }</TableCell>
									<TableCell key={row['id']+"_cell_quantity"}>{ row['quantity'] }</TableCell>
									<TableCell key={row['id']+"_cell_expire"}>{ row['date_expire'] }</TableCell>
									<TableCell key={row['id']+"_cell_location"}>{ LOCATION_CHOICES[row['location']] }</TableCell>
									<TableCell key={row['id']+"_cell_category"}>{ CATEGORY_CHOICES[row['category']] }</TableCell>
									<TableCell key={row['id']+"_cell_action"}>
										<Link onClick={() => handleUpdateClick(row)} to="update">Edit</Link>
										<br />
										<Link onClick={() => handleDeleteClick(row)} to="">Delete</Link>
									</TableCell>
								</TableRow>
								<TableRow key={row['id']+"_row_note"}>
									<TableCell key={row['id']+"_cell_note"} colSpan={6}>{ row['note'] }</TableCell>
								</TableRow>
							</Fragment>
						)
					})}
				</TableBody>
			</Table>
		</TableContainer>
	</div>
  )
}

export default ItemsList