import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import Feed from "../components/Feed"
import PostBlurtForm from "../components/forms/PostBlurtForm"
import defaultPFP from '../assets/images/default-pfp.png';
import moreIcon from '../assets/icons/more_icon_white.svg';
import '../styles/pages/homepage.css';

const HomePage = () => {
	let navigate = useNavigate();
	// Get Access Token
	const [accessToken] = useState(() => {
		try{
			const access_token = getToken('at')
			console.log(access_token)
			return access_token
		} catch(e){
			console.log(e)
			const res = isAuthenticated()
			console.log(res)
			window.location.replace('/')
		}
	})

	return (
		<div className="home">
			<div className="home-header">
				<div className="header-left">
				</div>
				<div className="title">
					<h1 onClick={()=> {
						navigate("/")
					}}>Chattrr</h1>
				</div>
				<div className="header-right">
					<div className="link-card">
						<img src={defaultPFP} width="35" height="35" alt={`s profile picture`} onClick={()=>{
							navigate(`../user/`);
						}}/>
						<div className="user-detail">
							<p className="display-name">Display Name</p>
							<p className="username">Username</p>
						</div>
						<img className="more" src={moreIcon} width="25" height="25" alt="more icon"/>
					</div>
				</div>
			</div>
			
			<div className="home-container">
				<div className="home-container-center">
					<PostBlurtForm accessToken={accessToken} />
					<Feed accessToken={accessToken} renderComment={true} />
				</div>
			</div>
		</div>
	);
}

export default HomePage;