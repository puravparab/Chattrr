import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dateDifference } from "../../utilities/time.js"
import defaultPFP from '../../assets/images/default-pfp.png';

const ProfileCard = (props) => {
	let navigate = useNavigate();
	const [accessToken, setAccessToken] = useState(props.accessToken)

	return (
		<div className="profile-card">
			<div className="profile-card-left">
				<img src={defaultPFP} width="32" height="32" alt={`${props.user.username}'s profile picture`} onClick={()=>{
					navigate(`/user/${props.user.username}`);
				}}/>
			</div>
			<div className="profile-card-right">
				<div className="profile-header">
					<div className="header-detail">
						<div className="username" onClick={()=>{
							navigate(`/user/${props.user.username}`);
						}}>
							<p>@{props.user.username}</p>
						</div>
						<div className="display-name" onClick={()=>{
							navigate(`/user/${props.user.username}`);
						}}>
							<p>{props.user.display_name}</p>
						</div>
					</div>
				</div>
				<div className="profile-body">
				</div>
				<div className="profile-footer">
					<p>Joined {dateDifference(props.user.created_at)}</p>
				</div>
			</div>
		</div>
	)
}

export default ProfileCard