import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import LogInForm from "../components/forms/LogInForm"
import SocialImage from "../assets/images/Social_Media_Monochromatic.svg"

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
			<div className="login-container">
				<img className="login-img" src={SocialImage}/>
				<LogInForm />
			</div>
		</div>
	);
}

export default LogIn;