import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../../actions/authActions.js"
import { dateDifference } from "../../utilities/time.js"
import '../../styles/components/cards/blurtcomment.css';
import heartGreyOutline from '../../assets/icons/heart_grey_outline.svg';
import heartRed from '../../assets/icons/heart_red.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const BlurtComment = (props) => {

	return (
		<div className="comment-card">
			<div className="pfp-container">
			</div>
			<div className="comment-container-right">
				<div className="comment-body">
					<div className="comment-body-header">
						<div className="display-name"><p>{"dummy_name"}</p></div>
						<div className="username"><p>@{props.username}</p></div>
						<div className="timestamp"><p>{dateDifference(props.created_at)}</p></div>
					</div>
					<div className="comment-content"><p>{props.content}</p></div>
				</div>
				<div className="comment-footer">
					<div className="comment-likes">
						<img src={heartGreyOutline} alt="like-btn" width="22" height="22"/>
						<span>0</span>
					</div>
				</div>
			</div>
		</div>
	)
};

export default BlurtComment;