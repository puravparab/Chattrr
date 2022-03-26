import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../../actions/authActions.js"
import { dateDifference } from "../../utilities/time.js"
import '../../styles/components/cards/blurtcard.css';
import heartGreyOutline from '../../assets/icons/heart_grey_outline.svg';
import heartRed from '../../assets/icons/heart_red.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// TODO: Timestamp incorrect for posts less than a day old in transition periods
const BlurtCard = (props) => {
	const [likeBtn, setLikeBtn] = useState('')
	const [likesNum, setLikesNum] = useState('')
	const [accessToken, setAccessToken] = useState(props.accessToken)
	const [comments, setComments] = useState(props.accessToken)
	let navigate = useNavigate();

	// Check if access token is valid
	const authCheck = () => {
		try{
			const access_token = getToken('at')
			setAccessToken(access_token)
		} catch(e){
			console.log(e)
			const res = isAuthenticated()
			if(res === false){
				window.location.replace('/')
			}
		}
	}

	useEffect(()=>{
		//Attempt to retreive data
		try {
			determineLike()
			getLikeNum()
			renderComments()
		}
		// TODO: Test This
		catch (e) {
			console.log(e)
		}
	}, [])

	// Determine if logged user has liked a blurt
	const determineLike = () => {
		if (props.likes_detail.has_user_liked) {
			setLikeBtn(heartRed)
		}
		else{
			setLikeBtn(heartGreyOutline)
		}
	}

	// Get number of likes on this blurt
	const getLikeNum = () => {
		if(props.likes_detail.no_of_likes === 0){
			setLikesNum('')
		}else{
			setLikesNum(props.likes_detail.no_of_likes)
		}
	}

	// Add or remove like on a blurt from the database
	const updateLike = async (blurt_id) => {
		const res = await fetch(ROOT_URL + '/blurt/like/' + blurt_id,{
			method: "POST",
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		// const data = await res.json()
		if(res.ok){
			return true
		}else{
			return false
		}
	}

	// Change like btn icon
	const changeLikeBtn = async (e) => {
		e.preventDefault()
		authCheck()
		// If blurt is liked
		if (likeBtn === heartGreyOutline){
			const res = await updateLike(props.id)
			if (res){
				setLikeBtn(heartRed)
				setLikesNum(likesNum + 1)
			}
		} 
		//  If blurt is unliked
		else if (likeBtn === heartRed){
			const res = await updateLike(props.id)
			if (res){
				setLikeBtn(heartGreyOutline)
				setLikesNum(likesNum - 1)
			}
		}
	}

	const renderComments = () => {
		if((window.location.href).split('/')[3] === 'home') {
			if(props.no_of_comments === 0){
				setComments("View comments")
			}else{
				setComments(`View ${props.no_of_comments} comments`)
			}
		}else{
			setComments("")
		}
	}

	return (
		<div className="blurt-card" >
			<div className="pfp-container">
			</div>
			<div className="blurt-container-right">
				<div className="blurt-body" >
					<div className="blurt-body-header">
						<div className="display-name" onClick={()=>{
							navigate(`/user/${props.username}`);
						}}>
							<p>{props.display_name}</p>
						</div>

						<div className="username" onClick={()=>{
							navigate(`/user/${props.username}`);
						}}>
							<p>@{props.username}</p>
						</div>

						<div className="timestamp"><p>{dateDifference(props.created_at)}</p></div>
					</div>
					<div className="blurt-content" onClick={()=>{
						navigate(`/user/${props.username}/status/${props.id}`);
					}}><p>{props.content}</p></div>
				</div>
				<div className="blurt-footer">
					<div className="blurt-comment-container" onClick={()=>{
						navigate(`/user/${props.username}/status/${props.id}`);
					}}>
						<span>
							{comments}
						</span>
					</div>
					<div className="blurt-likes">
						<img src={likeBtn} onClick={changeLikeBtn} alt="like-btn" width="22" height="22"/>
						<span className={likeBtn === heartRed ? "red" : "default"}>{likesNum}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BlurtCard