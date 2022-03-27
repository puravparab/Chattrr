import { useNavigate } from 'react-router-dom'
import defaultPFP from '../../assets/images/default-pfp.png';

const ProfileCard = (props) => {
	let navigate = useNavigate();
	
	return (
		<div className="profile-card">
			<div className="profile-card-left">
				<img src={defaultPFP} width="32" height="32" alt={`${props.username}'s profile picture`} onClick={()=>{
					navigate(`/user/${props.username}`);
				}}/>
			</div>
			<div className="profile-card-right">
				<div className="profile-header">
				</div>
				<div className="profile-body">
				</div>
				<div className="profile-footer">
				</div>
			</div>
		</div>
	)
}

export default ProfileCard