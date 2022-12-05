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

	const handleLinkClick = (item: Item) => {
		console.log('putting item in react session')
		ReactSession.set("itemToEdit", item);
		console.log(ReactSession.get("itemToEdit"))
		console.log("right after calling reactsession get")
	};


  return (
	<div className="items">
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
										<Link onClick={() => handleLinkClick(row)} to="update">Edit</Link>
										<br />
										<Link onClick={() => handleLinkClick(row)} to="delete">Delete</Link>
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