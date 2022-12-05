import React from 'react'
import { Outlet } from 'react-router-dom'

function Items() {
  return (
	<div className="items">		
		<Outlet />
	</div>
  )
}

export default Items