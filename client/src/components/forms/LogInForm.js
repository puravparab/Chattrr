import { useState } from 'react';
import { Link } from 'react-router-dom'
import '../../styles/components/forms/loginform.css';
import alertRed from '../../assets/icons/alert_red.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const LogInForm = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	// Handling the username change
	const handleUsername = (e) => {
		setUsername(e.target.value);
	};

	// Handling the password change
	const handlePassword = (e) => {
		setPassword(e.target.value);
	};

	// Redirect to homepage
	const redirect = () => {
		window.location.replace('/');
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (username === '' || password === ''){
			setError("Incorrect username or password") 
		}
		else{
			// POST User login details to accounts/login API
			setError("")
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
				const access_token = data["tokens"]["access"]
				const refresh_token = data["tokens"]["refresh"]
				const at_expiry = data["expiry"]["at_tk_expiry"]
				const rt_expiry = data["expiry"]["rt_tk_expiry"]

				// token expiry into date time format
				var at_date = new Date();
				at_date.setTime(at_date.getTime() + (parseInt(at_expiry) * 1000))

				var rt_date = new Date();
				rt_date.setTime(rt_date.getTime() + (parseInt(rt_expiry) * 1000))

				// Add tokens to cookies
				document.cookie = "at=" + access_token + ";expires=" + at_date.toUTCString() + "; samesite=lax"
				document.cookie = "rt=" + refresh_token + ";expires=" + rt_date.toUTCString() + "; samesite=lax"
				redirect()
			} else{
				// const errors = data["errors"]
				// console.log(errors)
				setError("Incorrect username or password")
				console.log("Incorrect username or password")
			}
		}
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

			{/* Replace a tags */}
			<div className="sign-up"><span>Dont have an account? <Link to='/register'>Sign up</Link></span></div>
		</div>
	);
}

export default LogInForm;