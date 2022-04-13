import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../../actions/authActions.js"
import { dateDifference } from "../../utilities/time.js"
import '../../styles/components/cards/blurtcomment.css';
import heartGreyOutline from '../../assets/icons/heart_grey_outline.svg';
import heartRed from '../../assets/icons/heart_red.svg';
import moreIcon from '../../assets/icons/more_icon_white.svg';
import trashIcon from '../../assets/icons/trash_red.svg';
import defaultPFP from '../../assets/images/default-pfp.png';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const BlurtComment = (props) => {
	const [likeBtn, setLikeBtn] = useState('')
	const [likesNum, setLikesNum] = useState('')
	const [accessToken, setAccessToken] = useState(props.accessToken)

	const [dialogBoxState, setDialogBoxState] = useState("dialog-box close")

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
		if ((props.likes_detail.no_of_likes) === 0){
			setLikesNum('')
		}else{
			setLikesNum(props.likes_detail.no_of_likes)
		}
	}

	// Add or remove like on comment from the database
	const updateLike = async (comment_id) => {
		const res = await fetch(ROOT_URL + '/blurt/comment/' + comment_id + '/like',{
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
		const res = await fetch(ROOT_URL + '/blurt/comment/delete/' + props.id, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		const data = await res.json()
		if(res.ok){
			navigate(0)
		}
	}

	return (
		<div className="comment-card">
			<div className="pfp-container">
				<img src={defaultPFP} width="32" height="32" alt={`${props.username}'s profile picture`} onClick={()=>{
						navigate(`/user/${props.username}`);
					}}/>
			</div>
			<div className="comment-container-right">
				<div className="comment-body">
					<div className="comment-body-header">
						<div className="header-left">
							<div className="display-name" onClick={()=>{
								navigate(`../../../../user/${props.username}`);
							}}>
								<p>{props.display_name}</p>
							</div>

							<div className="username" onClick={()=>{
								navigate(`../../../../user/${props.username}`);
							}}>
								<p>@{props.username}</p>
							</div>

							<div className="timestamp"><p>{dateDifference(props.created_at)}</p></div>
						</div>
						<div className="header-right">
							<img className="more" src={moreIcon} width="25" height="25" alt="more icon" onClick={handleDialogBox} />
							<div className={dialogBoxState}>
								{props.is_user_author ? 
									<div className="dialog-box-item delete"  onClick={()=>{
											handleDelete()
										}} >
										<img src={trashIcon} width="25" height="25" alt="delete btn" /> 
										<p>Delete</p>
									</div> : ""}
							</div>
						</div>
					</div>
					<div className="comment-content"><p>{props.content}</p></div>
				</div>
				<div className="comment-footer">
					<div className="comment-likes">
						<img src={likeBtn} onClick={changeLikeBtn} alt="like-btn" width="22" height="22"/>
						<span>{likesNum}</span>
					</div>
				</div>
			</div>
		</div>
	)
};

export default BlurtComment;