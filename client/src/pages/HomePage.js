import { useState } from 'react'
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import Feed from "../components/Feed"
import PostBlurtForm from "../components/forms/PostBlurtForm"
import '../styles/pages/homepage.css';

// const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const HomePage = () => {
	const [accessToken, setAccessToken] = useState(() => {
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
	const [refreshToken, setRefreshToken] = useState(() => {
		try{
			const refresh_token = getToken('rt')
			console.log(refresh_token)
			return refresh_token
		} catch(e){
			console.log(e)
			window.location.replace('/')
		}
	})

	return (
		<div className="home">
			<div className="home-container">
				<PostBlurtForm accessToken={accessToken} />
				<Feed />
			</div>
		</div>
	);
}

export default HomePage;