import React, { useState } from 'react'

function DeleteProfile() {
	const [issue, setIssue] = useState('');

	const handleButtonClick = (toDelete: boolean) => {
    if (toDelete) {
      fetch("/profile/delete", {
        method: "delete"
      }).then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          response.json().then((responseJson) => {
            console.log(responseJson['issue'])
            setIssue(responseJson['issue'])
          })
        }
      })
    } else {
      window.location.assign("/profile")
    }
		
	};

  return (
	<div className="confirmation">
    <h3>Are you sure you want to delete your account?</h3>
    <p>{issue ? issue : ''}</p>
    <button onClick={() => handleButtonClick(true)}>Yes</button>
    <button onClick={() => handleButtonClick(false)}>No</button>
  </div>
  )
}

export default DeleteProfile