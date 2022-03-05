import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import HomePage from "./pages/HomePage"
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"
import Error404Page from "./pages/Error404Page"

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

function App() {
	const [isAuth, setIsAuth] = useState(null)
	const [accessToken, setAccessToken] = useState('')
	const [refreshToken, setRefreshToken] = useState('')

	// Update valid Refresh token if Access token is invalid
	const updateAcessToken = async (refresh_token) => {
		try{
			const res = await fetch(ROOT_URL + '/accounts/token/refresh/' + refresh_token, {
				method: 'GET'
			})

			console.log(res)
			const data = await res.json()
			console.log(data)

			if(res.ok){
				const access_token = data["tokens"]["access_token"]
				const refresh_token = data["tokens"]["refresh_token"]
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
				window.location.replace('/')
			} else{
				// Refresh token invalid
				console.log(data)
				setIsAuth(false)
			}
		} catch(e){
			console.log(e)
			setIsAuth(false)
		}
	}

	const isAuthenticated = () => {
		// Get auth tokens from cookies
		try{
			let access_token = document.cookie.split('; ').find(row => row.startsWith('at')).split('=')[1]
			console.log(access_token)
			setAccessToken(access_token)
			setIsAuth(true)
		} catch(e){
			// Access token invalid
			console.log(e)
			try{
				let refresh_token = document.cookie.split('; ').find(row => row.startsWith('rt')).split('=')[1]
				setRefreshToken(refresh_token)
				updateAcessToken(refresh_token)
			} catch(e){
				// Refresh token invalid
				console.log(e)
				setIsAuth(false)
			}
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
				<Route exact path='/home' element={<Navigate replace to='/' />} />
				<Route exact path='/register' element={<Register isAuth={isAuth} />} />
				<Route exact path='/login' element={<LogIn isAuth={isAuth} />} />
				<Route 
					path='/' 
					element={ isAuth ? 
								<HomePage access_token={accessToken}  refresh_token={refreshToken} /> 
								: <Navigate to='/login' isAuth={isAuth} /> } />
				
				<Route path='*' element={<Error404Page />} />
			</Routes>
		</div>
	)
}

export default App;
