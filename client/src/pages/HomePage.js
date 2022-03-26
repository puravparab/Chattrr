import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import Feed from "../components/Feed"
import PostBlurtForm from "../components/forms/PostBlurtForm"
import '../styles/pages/homepage.css';

const HomePage = () => {
	let navigate = useNavigate();
	// Get Access Token
	const [accessToken] = useState(() => {
		try{
			const access_token = getToken('at')
			console.log(access_token)
			return access_token
		} catch(e){
			console.log(e)
			const res = isAuthenticated()
			console.log(res)
			window.location.replace('/')
		}
	})

	return (
		<div className="home">
			<div className="title">
				<h1 onClick={()=> {
					navigate("/")
				}}>Chattrr</h1>
			</div>
			<div className="home-container">
				<div className="home-container-center">
					<PostBlurtForm accessToken={accessToken} />
					<Feed accessToken={accessToken} renderComment={true} />
				</div>
			</div>
		</div>
	);
}

export default HomePage;