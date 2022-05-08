import { useNavigate } from 'react-router-dom'
import homeBtn from '../assets/icons/home_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
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
					navigate(`../user/${props.username}`, {replace: true})
				}}/>
			</div>
		</div>
	)
}

export default MobileNav