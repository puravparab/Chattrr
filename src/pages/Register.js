import { useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import RegisterForm from "../components/forms/RegisterForm"
import SocialImage from "../assets/images/Social_Media_Monochromatic.svg"

const Register = ({isAuth}) => {
	let navigate = useNavigate();

	useEffect(() => {
		document.title = "Register / Chattrr"
	},[])

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
			<div className="register-container">
				<img className="register-img" src={SocialImage}/>
				<RegisterForm />
			</div>

			<div className="register-footer">
				<p>&copy; 2022 CHATTRR</p>
			</div>
		</div>
	);
}

export default Register;