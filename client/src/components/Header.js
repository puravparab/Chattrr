import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from  "../actions/authActions.js"
import moreIcon from '../assets/icons/more_icon_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import backBtn from '../assets/icons/white_arrow.svg';
import '../styles/components/header.css';

const Header = (props) => {
	const [linkCardState, setLinkCardState] = useState('link-card')
	const [linkCardHeaderState, setLinkCardHeaderState] = useState('link-card-header')
	const [dialogState, setDialogState] = useState('dialog-box close')

	let navigate = useNavigate();

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
		<div className="home-header">
			<div className="header-left">
				{props.backBtn && 
					<img src={backBtn} alt="back-btn" width="30" height="30"
						onClick={()=> {
							navigate(-1)
						}} 
					/>
				}
			</div>
			<div className="title">
				<h1 onClick={()=> {
					navigate("/")
				}}>Chattrr</h1>
			</div>
			<div className="header-right">
				<div className={linkCardState} >
					<div className={linkCardHeaderState}>
						<img src={props.profileImage} width="35" height="35" alt={`${props.userDetail.username}'s profile picture`} onClick={()=>{
							{props.profilePage && window.location.replace(`../user/${props.userDetail.username}`)}
							{!props.profilePage && navigate(`../user/${props.userDetail.username}`)}
						}}/>
						<div className="user-detail">
							<p className="display-name">{props.userDetail.display_name}</p>
							<p className="username">@{props.userDetail.username}</p>
						</div>
						<img className="more" src={moreIcon} width="25" height="25" alt="more icon" onClick={handleDialogBox} />
					</div>
					<div className={dialogState}>
						<div className="dialog-list-item" onClick={()=>{
							{props.profilePage && window.location.replace(`../user/${props.userDetail.username}`)}
							{!props.profilePage && navigate(`../user/${props.userDetail.username}`)}
						}}>
							<img src={profileIcon} width="20" height="20" alt="profile-icon" />
							<p>Profile</p>
						</div>
						<div className="dialog-list-item log-out" onClick={()=>{
							logout()
						}}>
							<p>Log Out</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Header;