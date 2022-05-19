import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import Header from '../components/Header'
import BlurtCard from "../components/cards/BlurtCard.js"
import BlurtComment from "../components/cards/BlurtComment.js"
import PostCommentForm from "../components/forms/PostCommentForm.js"
import DesktopNav from '../components/DesktopNav'
import MobileNav from '../components/MobileNav'
import Search from '../components/Search'

import '../styles/pages/homepage.css';
import '../styles/pages/blurt.css';
import defaultPFP from '../assets/images/default-pfp.png';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const Blurt = () => {
	let params = useParams()
	let navigate = useNavigate();
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

	const [Blurt, setBlurt] = useState('')
	const [blurtComments, setBlurtComments] = useState('')

	const [userDetail, setUserDetail] = useState({
		username: "",
		display_name: ""
	})

	const [profileImage, setProfileImage] = useState(defaultPFP)

	useEffect(()=>{
		try{
			getUserDetail()
			getBlurt(params.id)
			getBlurtComments(params.id)
		}
		catch(e){
			console.log(e)
		}
	}, [])

	// Get details of the requesting user
	const getUserDetail = async () => {
		const res = await fetch(ROOT_URL + '/accounts/me', {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		const data = await res.json()
		if(res.ok){
			setUserDetail({
				username: data.user.username,
				display_name: data.user.display_name
			})

			// Set profile image
			if(data.user.profile_image === null){
				setProfileImage(defaultPFP)
			}
			else{
				setProfileImage(data.user.profile_image)
			}
		}else{
			console.log('user detail load failure')
		}
	}
  	
  	// Get Blurt Detail
  	const getBlurt = async (blurt_id) => {
 		const res = await fetch(ROOT_URL + '/blurt/' + blurt_id, {
 			method: "GET",
 			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
 		})
 		const data = await res.json()
 		console.log(data)
 		if(res.ok){
 			const Blurt = <BlurtCard
							id={blurt_id}
							username={data[0].username} 
							display_name={data[0].display_name}
							content={data[0].content}
							profile_image={data[0].profile_image}
							image={data[0].image}
							created_at={data[0].created_at} 
							likes_detail={data[0].likes_detail}
							no_of_comments={data[0].no_of_comments}
							accessToken={accessToken} 
							renderComment={false} 
							is_user_author={data[0].is_user_author} 
							blurt_page={true} />
			setBlurt(Blurt)
 		}else{
 			navigate('./error')
 		}
  	}

  	// Get List of comments
  	const getBlurtComments = async (blurt_id) => {
  		const res = await fetch(ROOT_URL + '/blurt/comment/' + blurt_id + '/list', {
  			method: 'GET',
  			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
  		})

		const data = await res.json()
		console.log(data)

  		if (res.ok){
  			const BlurtComments = await data.comments.map((blurtComment) => {
  				return <BlurtComment 
  							id={blurtComment.id}
  							blurt_id={blurtComment.blurt_id}
  							username={blurtComment.author}
  							display_name={blurtComment.display_name}
  							profile_image={blurtComment.profile_image}
  							content={blurtComment.content}
  							created_at={blurtComment.created_at}
  							likes_detail={blurtComment.likes_detail}
  							accessToken={accessToken} 
  							is_user_author={blurtComment.is_user_author} />
  			})
  			setBlurtComments(BlurtComments)
  		}else{
  			console.log("Blurt does not have any comments")
  		}
  	}

	return (
		<div className="home" >
			<Header 
				userDetail={userDetail}
				profileImage={profileImage}
				backBtn={true}
				profilePage={false}
			/>

			<div className="blurt-page-container">
				<div className="container-left">
					<DesktopNav username={userDetail.username} profilePage={false} />
				</div>
				<div className="blurt-container-center">
					<div className="blurt-container">
						{Blurt}
					</div>
					<div className="post-comment-container">
						<PostCommentForm accessToken={accessToken} blurt_id={params.id} />
					</div>
					<div className="comments-container">
						{blurtComments}
					</div>
				</div>
				<div className="container-right">
					<div className="container-right-search">
						<Search profilePage={false} />
					</div>
				</div>
			</div>

			<MobileNav username={userDetail.username} profilePage={false} />
		</div>
	)
}

export default Blurt;