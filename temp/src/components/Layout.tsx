import React, { ReactNode } from 'react'

import Navbar from "./Navbar"

interface Props {
  children?: ReactNode
  // any props that come into the component
}

function Layout({ children }: Props) {
  return (
	<div>
    <Navbar/>
    <div className="content">
      {children}
    </div>
  </div>
  )
}

export default Layout;