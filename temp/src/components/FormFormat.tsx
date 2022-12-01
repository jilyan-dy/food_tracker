import React from 'react'

function FormFormat(props: any) {
  const { label, onChange, id, ...inputProps } = props;

  return (
	<div className="field">
		<label>{ label }</label>
		<input {...inputProps} onChange={onChange}/>
	</div>
  )
}

export default FormFormat