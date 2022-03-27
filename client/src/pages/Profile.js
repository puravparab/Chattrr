import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import ProfileCard from "../components/cards/ProfileCard"
import ProfileFeed from "../components/ProfileFeed"
import '../styles/pages/profile.css';
import backBtn from '../assets/icons/white_arrow.svg';

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

	const [profile, setProfile] = useState('')

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
									no_of_blurts={data.no_of_blurts}
									accessToken={accessToken} />
			setProfile(profileCard)
		}else{
			navigate('../error')
		}
	}

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
					{profile}
					<ProfileFeed accessToken={accessToken} username={params.username} renderComment={true} />
				</div>
			</div>
		</div>
	)
}

export default Profile