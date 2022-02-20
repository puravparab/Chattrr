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
	
	// TODO: fix Auth token usage
	const [isAuth, setIsAuth] = useState(true)

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
