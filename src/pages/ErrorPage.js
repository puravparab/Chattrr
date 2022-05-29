import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../actions/authActions.js"

import Header from '../components/Header'
import MobileNav from '../components/MobileNav'

import '../styles/pages/homepage.css';
import '../styles/pages/errorpage.css';
import defaultPFP from '../assets/images/default-pfp.png';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const ErrorPage = (props) => {
	let navigate = useNavigate();
	// Get Access Token
	const [accessToken] = useState(() => {
		try{
			const access_token = getToken('at')
			return access_token
		} catch(e){
			console.log(e)
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
		<div className="error-page">
			<Header 
				userDetail={userDetail}
				profileImage={profileImage}
				backBtn={false}
				profilePage={props.profilePage}
			/>

			<div className="error-container">
				{props.type === "default" &&
					<p className="msg-one"> Error {props.status}: Sorry, this page isn't available. </p>
				}
				{props.type === "blurt" &&
					<p className="msg-one"> Error {props.status}: Sorry, this blurt doesn't exist. </p>
				}
				{props.type === "user" &&
					<p className="msg-one"> Error {props.status}: Sorry, this user doesn't exist. </p>
				}

				<p className="msg-two">The link you followed may be broken, or the page may have been removed.</p>
				<p className="msg-three" onClick={()=> {
					navigate('/')
				}}>
					Go back to Home.
				</p>
			</div>

			<MobileNav username={userDetail.username} profilePage={props.profilePage} />
		</div>
	);
}

export default ErrorPage;