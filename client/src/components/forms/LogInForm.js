import { useState } from 'react';
import { Navigate} from 'react-router-dom'
import '../../styles/components/forms/loginform.css';
import alertRed from '../../assets/icons/alert_red.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const LogInForm = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useState('')
	const [submitted, setSubmitted] = useState(false)

	// Handling the username change
	const handleUsername = (e) => {
		setUsername(e.target.value);
	};

	// Handling the password change
	const handlePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (username === '' || password === ''){
			setSubmitted(false)
			setError("Incorrect username or password") 
		}
		else{
			// POST User login details to accounts/login API
			const res = await fetch(ROOT_URL + '/accounts/login', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					"username": username,
					"password": password
				})
			})
			console.log(res)
			const data = await res.json()
			console.log(data)

			if(res.ok){
				const access_token = data["access"]
				const refresh_token = data["refresh"]
				// Add tokens to cookies
				document.cookie = "at=" + access_token + "; samesite=lax"
				document.cookie = "rt=" + refresh_token + "; samesite=lax"
				setSubmitted(true)
			} else{
				// const errors = data["errors"]
				// console.log(errors)
				setError("Incorrect username or password")
				console.log("Incorrect username or password")
				setSubmitted(false)
			}
		}
	}

	if (submitted) {
		return (
			<Navigate to='/' />
		)
	}
	return (
		<div className="login-form">
			<div className="title">
				<h1>Sign in to your account</h1> 
			</div>

			<form className="form">
				<div className="form-entry">
					<label className="label">Username</label>
					<input className="input" onChange={handleUsername} value={username} type="text" required/>
				</div>

				<div className="form-entry">
					<label className="label">password</label>
					<input className="input" onChange={handlePassword} value={password} type="password" required/>
				</div>

				{error !== "" ? (<div role="alert" className="alert">
									<img src={alertRed} alt="alert" width="20" height="20" />
									<span>{error}</span>
								</div>) : ("")}

				<button onClick={handleSubmit} className="btn-submit" type="submit">Log In</button>
			</form>

			<div className="sign-up"><span>Dont have an account? <a href="/register">Sign up</a></span></div>
		</div>
	);
}

export default LogInForm;