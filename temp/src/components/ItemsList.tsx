import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';

// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

import './itemsList.scss';

// interface Item {
// 	name: string,
// 	category: string,
// 	quantity: number,
// 	date_expire: string,
// 	location: string,
// 	note: string,
// }

// function createData(
// 	name: string,
// 	category: string,
// 	quantity: number,
// 	date_expire: string,
// 	location: string,
// 	note: string,
//   ) {
// 	return { name, category, quantity, date_expire, location };
//   }

function ItemsList() {

	useEffect(() => {
		fetch("/items", {
			method: "get"
		}).then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson)
		})
	}, []);


  return (
	<div className="items">
	</div>
  )
}

export default ItemsList