import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import RegisterForm from "../components/forms/RegisterForm"

const Register = ({isAuth}) => {
	let navigate = useNavigate();
	if(isAuth){ return <Navigate to='/' />}
	return (
		<div className="home register">
			<div className="register-header">
				<div className="title">
					<h1 onClick={()=> {
						navigate("/")
					}}>Chattrr</h1>
				</div>
			</div>
			<RegisterForm />
		</div>
	);
}

export default Register;