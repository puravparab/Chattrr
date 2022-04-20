import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dateDifference } from "../../utilities/time.js"
import EditProfileForm from "../forms/EditProfileForm.js"
import '../../styles/components/cards/profilecard.css';
import defaultPFP from '../../assets/images/default-pfp.png';

const ProfileCard = (props) => {
	let navigate = useNavigate();
	const [accessToken, setAccessToken] = useState(props.accessToken)
	const [profileImage, setProfileImage] = useState(defaultPFP)
	const [editModalClass, setIsEditModalClass] = useState('modal-close')

	useEffect(()=>{
		// Set profile image
		if(props.profile_image === null){
			setProfileImage(defaultPFP)
		}
		else{
			setProfileImage(props.user.profile_image)
		}
	}, [])

	const handleEditModel = (state) => {
		if (state) {
			setIsEditModalClass('modal-close')
		}else{
			setIsEditModalClass('modal-open')
		}
	}

	return (
		<div className="profile-card">
			<div className="profile-card-left">
				<img 
					src={profileImage} onerror={()=>{setProfileImage(defaultPFP)}} width="100" height="100" alt={`${props.user.username}'s profile picture`} 
					onClick={()=>{
						navigate(`/user/${props.user.username}`);
				}}/>
			</div>
			<div className="profile-card-right">
				<div className="profile-header">
					<div className="header-detail">
						<div className="display-name" onClick={()=>{
							navigate(`/user/${props.user.username}`);
						}}>
							<p>{props.user.display_name}</p>
						</div>
						<div className="username" onClick={()=>{
							navigate(`/user/${props.user.username}`);
						}}>
							<p>@{props.user.username}</p>
						</div>
					</div>
					{props.is_user ?
						<div className="header-edit-btn">
							<button className="edit-btn" onClick={()=>{handleEditModel(false)}}>Edit Profile</button>
							<div className={editModalClass}>
								<EditProfileForm handleEditModel={handleEditModel}/>
							</div>
						</div> : ""}
				</div>
				<div className="profile-body">
					{props.user.bio}
				</div>
				<div className="profile-footer">
					<p>{props.no_of_blurts} Blurts</p>
					<p>Joined {dateDifference(props.user.created_at)}</p>
				</div>
			</div>
		</div>
	)
}

export default ProfileCard