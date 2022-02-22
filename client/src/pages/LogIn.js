import React from 'react'
import { Navigate } from 'react-router-dom'
import LogInForm from "../components/forms/LogInForm"

const LogIn = ({isAuth}) => {
	if(isAuth){ return <Navigate to='/' />}
	return (
		<LogInForm />
	);
}

export default LogIn;