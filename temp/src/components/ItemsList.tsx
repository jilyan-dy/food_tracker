import React, { useState, useEffect, Fragment } from 'react'
import { Outlet } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './itemsList.scss';

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
			console.log(responseJson[0])
			setRows(responseJson)
		})
	}, []);


  return (
	<div className="items">
		<TableContainer component={Paper}>
			<Table className='table'>
				<TableHead>
					<TableRow>
						<TableCell>{ COLUMNS[0] }</TableCell>
						<TableCell>{ COLUMNS[1] }</TableCell>
						<TableCell>{ COLUMNS[2] }</TableCell>
						<TableCell>{ COLUMNS[3] }</TableCell>
						<TableCell>{ COLUMNS[4] }</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => {
						return(
							<Fragment>
								<TableRow key={row['id']}>
									<TableCell>{ row['name'] }</TableCell>
									<TableCell>{ row['quantity'] }</TableCell>
									<TableCell>{ row['date_expire'] }</TableCell>
									<TableCell>{ row['location'] }</TableCell>
									<TableCell>{ row['category'] }</TableCell>
								</TableRow>
								<TableRow key={row['id']+"_note"}>
									<TableCell colSpan={5}>{ row['note'] }</TableCell>
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