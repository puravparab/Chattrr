import { useState } from 'react';
import '../../styles/components/registerform.css';
import alertRed from '../../assets/icons/alert_red.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const RegisterForm = () =>{
	// States for Registration
	const [username, setUsername] = useState('')
	const [display_name, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	// States for checking the errors
	const [submitted, setSubmitted] = useState(false);
 	const [error, setError] = useState({
 		username: "",
 		email: "",
 		password: ""
 	});

	// Handling the username change
	const handleUsername = (e) => {
		setUsername(e.target.value);
		setError((error) => {
    		return {
				...error,
				username: "",
			}
    	})
		setSubmitted(false);
  	};

  	// Handling the display name change
 	const handleDisplayName = (e) => {
    	setDisplayName(e.target.value);
    	setSubmitted(false);
  	};
  
  	// Handling the email change
  	const handleEmail = (e) => {
    	setEmail(e.target.value);
    	setError((error) =>{
    		return {
				...error,
				email: "",
			}
    	})
    	setSubmitted(false);
  	};
  
	// Handling the password change
	const handlePassword = (e) => {
		setPassword(e.target.value);
		setError((error) => {
    		return {
				...error,
				password: "",
			}
    	})
		setSubmitted(false);
	};

	// Handling the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (username === '' || email === '' || password === '') {
			const usernameErr = username === '' ? ("Username cannot be blank") : ("")
			const emailErr = email === '' ? ("Email cannot be blank") : ("")
			const passwordErr =  password === '' ? ("Password cannot be blank") : ("")
			const errors = {
				username: usernameErr,
 				email: emailErr,
 				password: passwordErr
			}
			updateError(errors)
		} else {
			setSubmitted(true);
			const errors = {
				username: "",
 				email: "",
 				password: ""
			}
			updateError(errors)

			const csrftoken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1]
			// POST User registration details to accounts/register API
			const res = await fetch(ROOT_URL + '/accounts/register', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					'X-CSRFToken': csrftoken
				},
				body: JSON.stringify({
					"username": username,
					"display_name": display_name,
					"password": password,
					"email": email
				})
			})

			console.log(res)
			const data = await res.json()
			console.log(data)

			if(res.ok){
				const success = data["details"]
				console.log(success)
			} else{
				const errors = data["errors"]
				updateError(errors)
				console.log(errors)
				console.log(error)
			}
		}
  	};

	const updateError = (errors) => {
		setError((error) => {
			return {
				...error,
				username: errors["username"],
				email: errors["email"],
 				password: errors["password"]
			}
		})
	}

	const inputErrors = (error) => {
		if(error["username"] === "" && error["email"] === "" && error["password"] === ""){
			console.log("success")
			return false
		}else{
			return true
		}
	}

	return (
		<div className="register-form">
			<div className="title">
				<h1>Register your account</h1>
			</div>

			<form className="form">
				<div className="form-entry">
					<label className="label">Username</label>
					<input className={error.username !== "" ? ("input error") : ("input")} 
						onChange={handleUsername} value={username} type="text" required/>
					{error.username !== "" ? (<div role="alert" className="alert">
												<img src={alertRed} alt="alert" width="20" height="20"/>
												<span>{error.username}</span></div>) : ("")}
				</div>

				<div className="form-entry">
					<label className="label">Display Name</label>
					<input className="input" onChange={handleDisplayName} value={display_name} type="text" />
				</div>

				<div className="form-entry">
					<label className="label">Email</label>
					<input className={error.email !== "" ? ("input error") : ("input")}
						autocomplete="email" onChange={handleEmail} value={email} type="email" required/>
					{error.email !== "" ? (<div role="alert" className="alert">
												<img src={alertRed} alt="alert" width="20" height="20"/>
												<span>{error.email}</span></div>) : ("")}
				</div>

				<div className="form-entry">
					<label className="label">Password</label>
					<input className={error.password !== "" ? ("input error") : ("input")}
						autocomplete="new-password" onChange={handlePassword} value={password} type="password" required/>
					{error.password !== "" ? (<div role="alert" className="alert">
												<img src={alertRed} alt="alert" width="20" height="20"/>
												<span>{error.password}</span></div>) : ("")}
				</div>

				<button onClick={handleSubmit} className="btn-submit" type="submit">Create account</button>
			</form>
			
			<div className="sign-in"><span>Have an account? <a href="#">Sign in</a></span></div>
			
		</div>
	)
}

export default RegisterForm