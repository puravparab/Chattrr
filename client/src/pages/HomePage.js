import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import Feed from "../components/Feed"
import PostBlurtForm from "../components/forms/PostBlurtForm"
import defaultPFP from '../assets/images/default-pfp.png';
import moreIcon from '../assets/icons/more_icon_white.svg';
import profileICon from '../assets/icons/profile_icon_white2.svg'
import '../styles/pages/homepage.css';

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

	const [linkCardState, setLinkCardState] = useState('link-card')
	const [linkCardHeaderState, setLinkCardHeaderState] = useState('link-card-header')
	const [dialogState, setDialogState] = useState('dialog-box close')

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
		}else{
			console.log('user detail load failure')
		}
	}

	// Handle Dialog box
	const handleDialogBox = () => {
		if (dialogState === 'dialog-box close'){
			setDialogState('dialog-box')
			setLinkCardState('link-card fix-pos')
			setLinkCardHeaderState('link-card-header fix-style')
		}
		else{
			setDialogState('dialog-box close')
			setLinkCardState('link-card')
			setLinkCardHeaderState('link-card-header')
		}
	}

	return (
		<div className="home">
			<div className="home-header">
				<div className="header-left">
				</div>
				<div className="title">
					<h1 onClick={()=> {
						navigate("/")
					}}>Chattrr</h1>
				</div>
				<div className="header-right">
					<div className={linkCardState} >
						<div className={linkCardHeaderState}>
							<img src={defaultPFP} width="35" height="35" alt={`${userDetail.username}'s profile picture`} onClick={()=>{
								navigate(`../user/${userDetail.username}`);
							}}/>
							<div className="user-detail">
								<p className="display-name">{userDetail.display_name}</p>
								<p className="username">@{userDetail.username}</p>
							</div>
							<img className="more" src={moreIcon} width="25" height="25" alt="more icon" onClick={handleDialogBox} />
						</div>
						<div className={dialogState}>
							<div className="dialog-list-item" onClick={()=>{
								navigate(`../user/${userDetail.username}`);
							}}>
								<img src={profileICon} width="20" height="20" alt="profile-icon" />
								<p>Profile</p>
							</div>
							<div className="dialog-list-item log-out">
								<p>Log Out</p>
							</div>
						</div>
					</div>
				</div>
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