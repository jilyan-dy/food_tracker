import React from 'react'

function Logout() {
	fetch("/logout", {
		method: "post"
	}).then((response) => {
		if (response.redirected) {
			console.log(response)
			window.location.href = response.url;
		}
	})
  return (
	<></>
  )
}

export default Logout;