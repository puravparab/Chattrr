import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import LogInForm from "../components/forms/LogInForm"

const LogIn = ({isAuth}) => {
	let navigate = useNavigate();
	if(isAuth){ return <Navigate to='/' />}
	return (
		<div className="home login">
			<div className="login-header">
				<div className="title">
					<h1 onClick={()=> {
						navigate("/")
					}}>Chattrr</h1>
				</div>
			</div>
			<LogInForm />
		</div>
	);
}

export default LogIn;