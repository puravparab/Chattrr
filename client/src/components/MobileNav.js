import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import PostBlurtForm from "./forms/PostBlurtForm"

import homeBtn from '../assets/icons/home_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import searchIcon from '../assets/icons/whitesearch.svg'
import sendIcon from '../assets/icons/send_icon_purple.svg'
import crossWhite from '../assets/icons/cross_white.svg';
import '../styles/components/mobilenav.css';

const MobileNav = (props) => {
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
		<div className="mobile-nav">
			<div className="nav-item">
				<img src={homeBtn} width="30" height="30" alt="home button" onClick={()=>{
					navigate('/')
				}} />
			</div>
			<div className="nav-item">
				<img src={profileIcon} width="30" height="30" alt="profile button"  onClick={()=>{
					{props.profilePage && window.location.replace(`../user/${props.username}`)}
					{!props.profilePage && navigate(`../user/${props.username}`)}	
				}}/>
			</div>
			<div className="nav-item">
				<img src={searchIcon} width="30" height="30" alt="search button" />
			</div>
			<div className="nav-item">
				<img src={sendIcon} onClick={handleBlurtForm} width="30" height="30" alt="send button" />
			</div>

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

export default MobileNav