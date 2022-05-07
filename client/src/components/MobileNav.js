import homeBtn from '../assets/icons/home_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import '../styles/components/mobilenav.css';

const MobileNav = (props) => {
	return (
		<div className="mobile-nav">
			<div className="nav-item">
				<img src={homeBtn} width="30" height="30" alt="home button" />
			</div>
			<div className="nav-item">
				<img src={profileIcon} width="30" height="30" alt="profile button" />
			</div>
		</div>
	)
}

export default MobileNav