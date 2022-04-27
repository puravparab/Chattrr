import { useState } from 'react';
import { Link } from 'react-router-dom'
import validator from 'validator'
import '../../styles/components/forms/registerform.css';
import alertRed from '../../assets/icons/alert_red.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const RegisterForm = () =>{
	// States for Registration
	const [username, setUsername] = useState('')
	const [display_name, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	// States for logging errors
	const [error, setError] = useState({
		username: "",
		email: "",
		password: ""
	});

	// Stage in the registration process
	const [stage, setStage] = useState("1")

	// Handling the username change
	const handleUsername = (e) => {
		setUsername(e.target.value);
		setError((error) => {
			return {...error,username: ""}
		})
	};

	// Handling the display name change
	const handleDisplayName = (e) => {
		setDisplayName(e.target.value);
	};
  
	// Handling the email change
	const handleEmail = (e) => {
		setEmail(e.target.value);
		// Validate email
		if(emailValidation(e.target.value)){
			setError((error) =>{
				return {...error, email: ""}
			})
		}else{
			setError((error) =>{
				return {...error, email: "Enter a valid email"}
			})
		}
	};
  	
  	// Email validation function
  	const emailValidation = (email) =>{
  		if(email === "" || validator.isEmail(email)){
  			return true
  		} else if(email !== "" && !validator.isEmail(email)){
            return false;
        } 
    }

	// Handling the password change
	const handlePassword = (e) => {
		setPassword(e.target.value);
		setError((error) => {
			return {...error, password: ""}
		})
	};

	const redirect = () => {
		window.location.replace('/');
	}
	// Handling the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if(stage === "1"){
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
				const errors = {
					username: "",
					email: "",
					password: ""
				}
				updateError(errors)
				
				// POST User registration details to accounts/register API
				const res = await fetch(ROOT_URL + '/accounts/register', {
					method: 'POST',
					headers: {
						'Content-type': 'application/json'
						// 'X-CSRFToken': csrftoken
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

					console.log(success)
					// redirect()
					setStage("2")
				} else{
					const errors = data["errors"]
					updateError(errors)
					console.log(errors)
					console.log(error)
				}
			}
		} else if (stage === "2"){

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

	return (
		<div className="register-form">
			<div className="title">
				<h1>Register your account</h1>
			</div>

			<div className="stage-no">
				<p>STEP {stage} OF 2 </p>
			</div>

			<form className="form">
				{stage === "1" &&
					(<>
						<div className="form-entry">
							<label className="label">Username</label>
							<input className={error.username !== "" ? ("input error") : ("input")} 
								onChange={handleUsername} value={username} type="text" required/>
							{error.username !== "" ? (<div role="alert" className="alert">
														<img src={alertRed} alt="alert" width="20" height="20"/>
														<span>{error.username}</span></div>) : ("")}
						</div>

						{/* <div className="form-entry"> */}
						{/* 	<label className="label">Display Name</label> */}
						{/* 	<input className="input" onChange={handleDisplayName} value={display_name} type="text" /> */}
						{/* </div> */}

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
					</>)
				}

				{stage === "2" &&
					(<div className="form-entry">
						<label className="label">Display Name</label>
						<input className="input" onChange={handleDisplayName} value={display_name} type="text" />
					</div>)
				}

				<button onClick={handleSubmit} className="btn-submit" type="submit">
					{stage === "1" && "Create account"}
					{stage === "2" && "Finish"}
				</button>
			</form>
			
			<div className="sign-in"><span>Have an account? <Link to='/login'>Sign in</Link></span></div>
		</div>
	)
}

export default RegisterForm