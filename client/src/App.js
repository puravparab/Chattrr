import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import HomePage from "./pages/HomePage"
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"
import Error404Page from "./pages/Error404Page"
import { isAuthenticated } from  "./actions/authActions.js"

function App() {
	const [isAuth, setIsAuth] = useState(null)

	if(isAuth === null){
		const res = isAuthenticated()
		setIsAuth(res)
	}

	return (
		<div className="App">
			{/* <div> */}
			{/* 	<Link to="/register">Register</Link> |{" "} */}
			{/* 	<Link to="/login">Log In</Link> */}
			{/* </div> */}
			<Routes>
				<Route exact path='/home' element={<Navigate replace to='/' />} />
				<Route exact path='/register' element={<Register isAuth={isAuth} />} />
				<Route exact path='/login' element={<LogIn isAuth={isAuth} />} />
				<Route 
					path='/' 
					element={ isAuth ? 
								<HomePage /> 
								: <Navigate to='/login' isAuth={isAuth} /> } />
				
				{/* Test Routes */}
				<Route exact path='home/test' element={<HomePage /> } />

				{/* Other */}
				<Route path='*' element={<Error404Page />} />
			</Routes>
		</div>
	)
}

export default App;
