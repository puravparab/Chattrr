import React, { useState } from 'react'
import { Routes, Route, Link, Navigate} from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import HomePage from "./pages/HomePage"
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"
import Error404Page from "./pages/Error404Page"

// TODO: Fix url refresh
function App() {
	const [tokens, setTokens] = useState({
		access_token: 'sh',
		refresh_token: 's'
	})

	const isAuthenticated = () => {
		try{
			let access_token = document.cookie.split('; ').find(row => row.startsWith('at')).split('=')[1]
			let refresh_token = document.cookie.split('; ').find(row => row.startsWith('rt')).split('=')[1]

			setTokens((tokens) =>{
				return {
					...tokens,
					access_token: access_token,
					refresh_token: refresh_token
				}
			})
			return true
		} catch(e){
			console.log(e)
			return false
		}
	}

	// TODO: fix Auth token usage
	const [isAuth, setIsAuth] = useState(isAuthenticated)

	return (
		<div className="App">
			<h1 className="title">Chattrr</h1>
			<div>
				<Link to="/register">Register</Link> |{" "}
				<Link to="/login">Log In</Link>
			</div>
			<Routes>
				<Route exact path='/register' element={<Register />} />
				<Route exact path='/login' element={<LogIn />} />
				{ isAuth ? 
					<Route path='/' element={<HomePage access_token={tokens.access_token}  refresh_token={tokens.refresh_token} />} /> : 
					<Route path='/' element={<Navigate replace to='/login' />} />
				}
				<Route path='*' element={<Error404Page />} />
			</Routes>
		</div>
	);
}

export default App;
