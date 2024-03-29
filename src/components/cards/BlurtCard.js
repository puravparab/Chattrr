import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../../actions/authActions.js"
import { dateDifference } from "../../utilities/time.js"
import ImageView from "../../pages/ImageView.js"

import '../../styles/components/cards/blurtcard.css';
import heartGreyOutline from '../../assets/icons/heart_grey_outline.svg';
import heartRed from '../../assets/icons/heart_red.svg';
import moreIcon from '../../assets/icons/more_icon_white.svg';
import trashIcon from '../../assets/icons/trash_red.svg';
import defaultPFP from '../../assets/images/default-pfp.png';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// TODO: Timestamp incorrect for posts less than a day old in transition periods
const BlurtCard = (props) => {
	const [likeBtn, setLikeBtn] = useState('')
	const [likesNum, setLikesNum] = useState('')
	const [accessToken, setAccessToken] = useState(props.accessToken)
	const [comments, setComments] = useState(props.accessToken)
	const [profileImage, setProfileImage] = useState(defaultPFP)
	const [dialogBoxState, setDialogBoxState] = useState("dialog-box close")
	const [imageViewState, setImageViewState] = useState(false)

	let navigate = useNavigate();

	// Check if access token is valid
	const authCheck = () => {
		try{
			const access_token = getToken('at')
			setAccessToken(access_token)
		} catch(e){
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

		// Set profile image
		if(props.profile_image === null){
			setProfileImage(defaultPFP)
		}
		else{
			setProfileImage(props.profile_image)
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
		if(props.renderComment === true) {
			if(props.no_of_comments === 0){
				setComments("View comments")
			}else{
				setComments(`View ${props.no_of_comments} comments`)
			}
		}else{
			setComments("")
		}
	}

	const handleDialogBox = () => {
		if (dialogBoxState === 'dialog-box close'){
			setDialogBoxState('dialog-box')
		}
		else{
			setDialogBoxState('dialog-box close')
		}
	}

	const handleDelete = async () => {
		authCheck()
		const res = await fetch(ROOT_URL + '/blurt/delete/' + props.id, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		const data = await res.json()
		if(res.ok){
			if (props.blurt_page) {
				navigate(-1)
			}else{
				navigate(0)
			}
		}
	}

	const handleImageViewer = () => {
		if(imageViewState){
			setImageViewState(false)
		}else{
			setImageViewState(true)
		}
	}

	return (
		<div className="blurt-card" >
			<div className="pfp-container">
				<img 
					src={profileImage} width="48" height="48" alt={`${props.username}'s profile picture`}
					onClick={()=>{
						navigate(`/user/${props.username}`);
				}}/>
			</div>
			<div className="blurt-container-right">
				<div className="blurt-body" >
					<div className="blurt-body-header">
						<div className="header-left">
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
						<div className="header-right">
							<img className="more" src={moreIcon} width="25" height="25" alt="more icon" onClick={handleDialogBox} />
							<div className={dialogBoxState}>
								<div className="dialog-box-item" onClick={changeLikeBtn}>
									<p>
										{likeBtn === heartGreyOutline && "Like"}
										{likeBtn === heartRed && "Unlike"}
									</p>
								</div>
								<div className="dialog-box-item" onClick={()=>{
									navigate(`/user/${props.username}`);
								}}>
									<p>Show Profile</p>
								</div>
								<div className="dialog-box-item" onClick={()=>{
									navigate(`/user/${props.username}/status/${props.id}`);
								}}>
									<p>Show Comments</p>
								</div>
								{props.is_user_author ? 
									<div className="dialog-box-item delete"  onClick={()=>{
											handleDelete()
										}} >
										<img src={trashIcon} width="25" height="25" alt="delete btn" /> 
										<p>Delete</p>
									</div> : ""
								}
							</div>
						</div>
					</div>

					<div className="blurt-content" onClick={()=>{
						navigate(`/user/${props.username}/status/${props.id}`);
					}}><p>{props.content}</p></div>

					{props.image != null?
						(<div className="blurt-media">
							<img src={props.image} onClick={handleImageViewer}/>
							{imageViewState && <ImageView image={props.image} handleImageViewer={handleImageViewer} />}
						</div>)
						: ("")
					}
					
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