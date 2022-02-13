import { useState } from 'react';
import '../../styles/components/forms/loginform.css';

const LogInForm = () => {
	return (
		<div className="login-form">
			<div className="title">
				<h1>Sign in to your account</h1> 
			</div>

			<form className="form">
				<div className="form-entry">
					<label className="label">Username</label>
					<input className="input" />
				</div>

				<div className="form-entry">
					<label className="label">password</label>
					<input className="input" />
				</div>

				<button onClick="" className="btn-submit" type="submit">Log In</button>
			</form>

			<div className="sign-up"><span>Dont have an account? <a href="/register">Sign up</a></span></div>
		</div>
	);
}

export default LogInForm;