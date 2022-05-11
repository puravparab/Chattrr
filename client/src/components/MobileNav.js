import { useNavigate } from 'react-router-dom'
import homeBtn from '../assets/icons/home_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import searchIcon from '../assets/icons/whitesearch.svg'
import sendIcon from '../assets/icons/send_icon_purple.svg'
import '../styles/components/mobilenav.css';

const MobileNav = (props) => {
	let navigate = useNavigate();
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
				<img src={sendIcon} width="30" height="30" alt="send button" />
			</div>
		</div>
	)
}

export default MobileNav