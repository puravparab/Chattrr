import { useState } from 'react'

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const RegisterForm = () =>{
	// States for Registration
	const [username, setUsername] = useState('')
	const [display_name, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')

	// States for checking the errors
	const [submitted, setSubmitted] = useState(false);
 	const [error, setError] = useState(false);

	// Handling the username change
	const handleUsername = (e) => {
		setUsername(e.target.value);
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
    	setSubmitted(false);
  	};
  
	// Handling the password change
	const handlePassword = (e) => {
		setPassword(e.target.value);
		setSubmitted(false);
	};

	// Handling the password2 change
	const handlePassword2 = (e) => {
		setPassword2(e.target.value);
		setSubmitted(false);
	};

	// Handling the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (username === '' || display_name === '' || email === '' || password === '' || password2 === '') {
			setError(true);
		} else {
			setSubmitted(true);
			setError(false);

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
			console.log(res.json())
		}
  	};

	// Showing success message
	const successMessage = () => {
		return (
			<div className="success" style={{display: submitted ? '' : 'none'}} >
				<h1>User {username} successfully registered!!</h1>
			</div>
		);
	};

	// Showing error message if error is true
	const errorMessage = () => {
		return (
			<div className="error" style={{display: error ? '' : 'none'}} >
				<h1>Please enter all the fields</h1>
			</div>
		);
	};

	return (
		<div className="register-form">
			<div>
				<h1>Register an account</h1>
			</div>

			<div className="messages">
        		{errorMessage()}
        		{successMessage()}
      		</div>

			<form>
				<label className="label">Username</label>
				<input className="input" onChange={handleUsername} value={username} type="text" required/>

				<label className="label">Display Name</label>
				<input className="input" onChange={handleDisplayName} value={display_name} type="text" required/>

				<label className="label">Email</label>
				<input className="input" onChange={handleEmail} value={email} type="email" required/>

				<label className="label">Password</label>
				<input className="input" onChange={handlePassword} value={password} type="password" required/>

				<label className="label">Confirm Password</label>
				<input className="input" onChange={handlePassword2} value={password2} type="password" required/>

				<button onClick={handleSubmit} className="btn" type="submit">Submit</button>

			</form>
		</div>
	)
}

export default RegisterForm