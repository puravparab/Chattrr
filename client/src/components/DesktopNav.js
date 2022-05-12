import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import PostBlurtForm from "./forms/PostBlurtForm"

import homeBtn from '../assets/icons/home_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import crossWhite from '../assets/icons/cross_white.svg';
import '../styles/components/desktopnav.css';

const DesktopNav = (props) => {
	let navigate = useNavigate();
	const [accessToken] = useState(() => {
		try{
			const access_token = getToken('at')
			return access_token
		} catch(e){
			const res = isAuthenticated()
			window.location.replace('/')
		}
	})
	const [BlurtFormVisible, setBlurtFormVisible] = useState(false)

	const handleBlurtForm = () =>{
		if (BlurtFormVisible){
			setBlurtFormVisible(false)
		}else{
			setBlurtFormVisible(true)
		}
	}

	return (
		<div className="desktop-nav">
			<div className="nav-item" onClick={()=>{
				navigate('/')
			}}>
				<img src={homeBtn} width="25" height="25" alt="home button" />
				<p>Home</p>
			</div>
			<div className="nav-item" onClick={()=>{
				{props.profilePage && window.location.replace(`../user/${props.username}`)}
				{!props.profilePage && navigate(`../user/${props.username}`)}	
			}}>
				<img src={profileIcon} width="25" height="25" alt="profile button"/>
				<p>Profile</p>
			</div>

			<button onClick={handleBlurtForm}>Post Blurt</button>

			{BlurtFormVisible && 
				<div className="post-blurt-modal-container">
					<div className="post-blurt-modal">
						<div className="post-blurt-modal-header">
							<img src={crossWhite} onClick={handleBlurtForm} alt="close" width="20" height="20" />
						</div>
						<PostBlurtForm accessToken={accessToken} />
					</div>
				</div>
			}
		</div>
	)
}

export default DesktopNav