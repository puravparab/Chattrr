import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
// import PrivateRoute from './utilities/PrivateRoute.js'
import Register from "./pages/Register"
import LogIn from "./pages/LogIn"

function App() {
	return (
		<Router>
			<div className="App">
				<h1 className="title">Chattrr</h1>
				<div>
					<Link to="/register">Register</Link> |{" "}
					<Link to="/login">Log In</Link>
				</div>
				<Routes>
					<Route path='/register' element={<Register/>} />
					<Route path='/login' element={<LogIn />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
