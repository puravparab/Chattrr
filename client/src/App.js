import React from 'react'
import { Routes, Route, Link} from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"
import Error404Page from "./pages/Error404Page"

// TODO: Fix url refresh
// TODO: Add an error page
function App() {
	return (
		<div className="App">
			<h1 className="title">Chattrr</h1>
			<div>
				<Link to="/register">Register</Link> |{" "}
				<Link to="/login">Log In</Link>
			</div>
			<Routes>
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<LogIn />} />
				<Route path='*' element={<Error404Page />} />
			</Routes>
		</div>
	);
}

export default App;
