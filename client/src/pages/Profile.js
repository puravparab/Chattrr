import { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import ProfileFeed from "../components/ProfileFeed"
import backBtn from '../assets/icons/white_arrow.svg';

const Profile = () =>{
	let params = useParams()
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
			<div className="header">
				<img src={backBtn} alt="back-btn" width="30" height="30"
					onClick={()=> {
						navigate(-1)
					}} />
				<div className="title">
					<h1 onClick={()=> {
						navigate("/")
					}}>Chattrr</h1>
				</div>
			</div>
			<div className="profile-container">
				<div className="profile-container-center">
					<ProfileFeed accessToken={accessToken} username={params.username} />
				</div>
			</div>
		</div>
	)
}

export default Profile