import { useNavigate } from 'react-router-dom'
import homeBtn from '../assets/icons/home_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import '../styles/components/desktopnav.css';

const DesktopNav = (props) => {
	let navigate = useNavigate();
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
		</div>
	)
}

export default DesktopNav