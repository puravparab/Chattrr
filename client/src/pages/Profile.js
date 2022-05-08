import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import Header from '../components/Header'
import ProfileCard from "../components/cards/ProfileCard"
import ProfileFeed from "../components/ProfileFeed"
import MobileNav from '../components/MobileNav'

import '../styles/pages/homepage.css';
import '../styles/pages/profile.css';
import defaultPFP from '../assets/images/default-pfp.png';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

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

	const [userDetail, setUserDetail] = useState({
		username: "",
		display_name: ""
	})

	const [profile, setProfile] = useState('')
	const [profileImage, setProfileImage] = useState(defaultPFP)

	useEffect(() => {
		//Attempt to retreive data
		try {
			getLoggedUserDetail()
			getUserDetail()
		}
		// TODO: Test This
		catch (e) {
			console.log(e)
		}
	}, [])

	// Get details of the requesting user
	const getLoggedUserDetail = async () => {
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

	// Get details of the requested user
	const getUserDetail = async () => {
		const res = await fetch(ROOT_URL + '/accounts/' + params.username, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		const data = await res.json()
		if(res.ok){
			const profileCard = <ProfileCard 
									user={data.user}
									is_user={data.is_user}
									no_of_blurts={data.no_of_blurts}
									accessToken={accessToken} />
			setProfile(profileCard)
		}else{
			navigate('../error')
		}
	}

	return (
		<div className="home">
			<Header 
				userDetail={userDetail}
				profileImage={profileImage}
				backBtn={true}
				profilePage={true}
			/>

			<div className="profile-container">
				<div className="profile-container-center">
					{profile}
					<ProfileFeed accessToken={accessToken} username={params.username} renderComment={true} />
				</div>
			</div>

			<MobileNav username={userDetail.username} profilePage={true} />
		</div>
	)
}

export default Profile