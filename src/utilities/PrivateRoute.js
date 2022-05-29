// import React from 'react'
// import { Route, Routes, Navigate } from 'react-router-dom'
// 
// const PrivateRoute = ({ components, ...rest}) => {
// 	let authenticated = true
// 	return (
// 		<Routes>
// 			<Route {...rest}> 
// 				{!authenticated ? <Navigate to="/login" /> : components}
// 			</Route>
// 		</Routes>
// 	)
// }
// 
// export default PrivateRoute