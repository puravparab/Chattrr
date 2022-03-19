import React, { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import HomePage from "./pages/HomePage"
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"
import Blurt from "./pages/Blurt"
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
			<Routes>
				<Route exact path='/' element={<Navigate replace to='/home' />} />
				<Route exact path='/register' element={<Register isAuth={isAuth} />} />
				<Route exact path='/login' element={<LogIn isAuth={isAuth} />} />

				<Route 
					path='/home' 
					element={ isAuth ? 
								<HomePage /> 
								: <Navigate to='/login' isAuth={isAuth} /> } >
				</Route>

				<Route path='user/:username/status/:id' element={<Blurt />} />

				{/* Other */}
				<Route path='*' element={<Error404Page />} />
			</Routes>
		</div>
	)
}

export default App;
