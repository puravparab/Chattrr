import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import HomePage from "./pages/HomePage"
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"
import Error404Page from "./pages/Error404Page"

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

function App() {
	const [isAuth, setIsAuth] = useState(null)
	const [tokens, setTokens] = useState({
		access_token: '',
		refresh_token: ''
	})

	// const validateToken = async (access_token) => {
	// 	try{
	// 		console.log(access_token)
	// 		const res = await fetch(ROOT_URL + '/accounts/token/validate', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Authorization': `Bearer ${access_token}`
	// 			}
	// 		})
	// 		const data = await res.json()
	// 		if(res.ok){
	// 			console.log(data)
	// 			return true
	// 		}
	// 		else{
	// 			console.log(data)
	// 			return false
	// 		}
	// 	} catch(e){
	// 		console.log(e)
	// 		return false
	// 	}
	// }

	const isAuthenticated = () => {
		// Get auth tokens from cookies
		try{
			let access_token = document.cookie.split('; ').find(row => row.startsWith('at')).split('=')[1]
			let refresh_token = document.cookie.split('; ').find(row => row.startsWith('rt')).split('=')[1]
			console.log(access_token)
			setTokens((tokens) =>{
				return {
					...tokens,
					access_token: access_token,
					refresh_token: refresh_token
				}
			})
			setIsAuth(true)
		} catch(e){
			console.log(e)
			setIsAuth(false)
		}
	}

	if(isAuth === null){
		isAuthenticated()
	}

	return (
		<div className="App">
			<h1 className="title">Chattrr</h1>
			<div>
				<Link to="/register">Register</Link> |{" "}
				<Link to="/login">Log In</Link>
			</div>
			<Routes>
				<Route exact path='/register' element={<Register isAuth={isAuth} />} />
				<Route exact path='/login' element={<LogIn isAuth={isAuth} />} />
				<Route 
					path='/' 
					element={ isAuth ? 
								<HomePage access_token={tokens.access_token}  refresh_token={tokens.refresh_token} /> 
								: <Navigate to='/login' isAuth={isAuth} /> } />
				
				<Route path='*' element={<Error404Page />} />
			</Routes>
		</div>
	)
}

export default App;
