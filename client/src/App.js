import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import HomePage from "./pages/HomePage"
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"
import Error404Page from "./pages/Error404Page"

function App() {
	const [isAuth, setIsAuth] = useState(null)
	const [tokens, setTokens] = useState({
		access_token: '',
		refresh_token: ''
	})

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
				<Route exact path='/home' element={<Navigate replace to='/' />} />
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
