import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import Feed from "../components/Feed"
import PostBlurtForm from "../components/forms/PostBlurtForm"
import Header from '../components/Header'
import DesktopNav from '../components/DesktopNav'
import MobileNav from '../components/MobileNav'
import Search from '../components/Search'

import '../styles/pages/homepage.css';
import defaultPFP from '../assets/images/default-pfp.png';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const HomePage = () => {
	let navigate = useNavigate();
	// Get Access Token
	const [accessToken] = useState(() => {
		try{
			const access_token = getToken('at')
			return access_token
		} catch(e){
			const res = isAuthenticated()
			window.location.replace('/')
		}
	})

	const [userDetail, setUserDetail] = useState({
		username: "",
		display_name: ""
	})

	const [profileImage, setProfileImage] = useState(defaultPFP)

	useEffect(() => {
		document.title = "Home / Chattrr";

		//Attempt to retreive data
		try {
			getUserDetail()
		}
		// TODO: Test This
		catch (e) {
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
		}
	}

	return (
		<div className="home">
			<Header 
				userDetail={userDetail}
				profileImage={profileImage}
				backBtn={false}
				profilePage={false}
			/>
			
			<div className="home-container">
				<div className="container-left">
					<DesktopNav username={userDetail.username} profilePage={false} />
				</div>
				<div className="home-container-center">
					<PostBlurtForm accessToken={accessToken} />
					<Feed accessToken={accessToken} renderComment={true} />
				</div>
				<div className="container-right">
					<div className="container-right-search">
						<Search profilePage={false} />
					</div>
				</div>
			</div>

			<MobileNav username={userDetail.username} profilePage={false} />
		</div>
	);
}

export default HomePage;