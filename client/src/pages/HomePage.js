import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import Feed from "../components/Feed"
import PostBlurtForm from "../components/forms/PostBlurtForm"
import Header from '../components/Header'

import '../styles/pages/homepage.css';
import defaultPFP from '../assets/images/default-pfp.png';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

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

	const [userDetail, setUserDetail] = useState({
		username: "",
		display_name: ""
	})

	const [profileImage, setProfileImage] = useState(defaultPFP)

	useEffect(() => {
		//Attempt to retreive data
		try {
			getUserDetail()
		}
		// TODO: Test This
		catch (e) {
			console.log(e)
		}
	}, [])

	// Get details of the requesting user
	const getUserDetail = async () => {
		const res = await fetch(ROOT_URL + '/accounts/me', {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		const data = await res.json()
		if(res.ok){
			setUserDetail({
				username: data.user.username,
				display_name: data.user.display_name
			})

			// Set profile image
			if(data.user.profile_image === null){
				setProfileImage(defaultPFP)
			}
			else{
				setProfileImage(data.user.profile_image)
			}
		}else{
			console.log('user detail load failure')
		}
	}

	return (
		<div className="home">
			<Header 
				userDetail={userDetail}
				profileImage={profileImage}
				backBtn={false}
			/>
			
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