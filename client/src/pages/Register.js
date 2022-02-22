import React from 'react'
import { Navigate } from 'react-router-dom'
import RegisterForm from "../components/forms/RegisterForm"

const Register = ({isAuth}) => {
	if(isAuth){ return <Navigate to='/' />}
	return (
		<RegisterForm />
	);
}

export default Register;