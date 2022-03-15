import { useState, useEffect } from 'react'
import '../../styles/components/cards/blurtcard.css';
import heartGreyOutline from '../../assets/icons/heart_grey_outline.svg';
import heartRed from '../../assets/icons/heart_red.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// TODO: Timestamp incorrect for posts less than a day old in transition periods
const BlurtCard = (props) => {
	const [likeBtn, setLikeBtn] = useState('')
	const [likesNum, setLikesNum] = useState('')

	useEffect(()=>{
		//Attempt to retreive data
		try {
			determineLike(props.id, props.accessToken)
			getLikeNum()
		}
		// TODO: Test This
		catch (e) {
			console.log(e)
		}
	}, [])

	const splitISO = (ISODateTime) =>{
		const dateTime = (ISODateTime.split("Z"))[0].split("T")

		// Parse date
		const date = dateTime[0].split("-")
		const year = date[0]
		const month = date[1]
		const day = date[2]
		const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

		// Parse time
		const time = dateTime[1].split(":")
		const hour = time[0]
		const minute = time[1]
		const seconds = time[2]

		return [[year, month, monthList[month - 1], day],
				[hour, minute, seconds]]
	}

	const dateDifference = (postDate) =>{
		// console.log("rawdate:" + postDate)

		const currentTimeISO = (new Date()).toISOString()
		// console.log("current time:" + currentTimeISO)

		const currDateTime = splitISO(currentTimeISO)
		const postDateTime = splitISO(postDate)

		// console.log("c: " + currDateTime)
		// console.log("p: " + postDateTime)

		const yearDiff = currDateTime[0][0] - postDateTime[0][0]
		// If post is older than a year
		if (yearDiff > 0){
			// monthName day, year
			return (postDateTime[0][2] + " " + postDateTime[0][3] + ", " + postDateTime[0][0])
		}
		else{
			// If post is older than a month
			if(currDateTime[0][2] !== postDateTime[0][2]){
				// monthName day
				return (postDateTime[0][2] + " " + postDateTime[0][3])
			}
			else{
				// If post is older than day
				if(currDateTime[0][3] !== postDateTime[0][3]){
					// monthName day
					return (postDateTime[0][2] + " " + postDateTime[0][3])
				}
				else{
					// If post is older than an hour
					const hourDiff = currDateTime[1][0] - postDateTime[1][0]
					if(hourDiff !== 0){
						return (hourDiff + "h")
					}
					else{
						// IF post is older than the minute
						const minDiff = currDateTime[1][1] - postDateTime[1][1]
						if(minDiff !== 0){
							return (minDiff + "m")
						}
						else{
							const secondDiff = Math.ceil(currDateTime[1][2] - postDateTime[1][2])
							return (secondDiff + "s")
						}
					}
				}
			}
		}
	}

	const determineLike = async (blurt_id, accessToken) => {
			const res = await fetch(ROOT_URL + '/blurt/like/' + blurt_id, {
				method: "GET",
				headers: {
					'Authorization': "Bearer " + accessToken
				}
			})

			const data = await res.json()

			if (res.ok){
				if(data["liked"] === "true"){
					setLikeBtn(heartRed)
				}else{
					setLikeBtn(heartGreyOutline)
				}
			} else{
				console.log("cant retrieve like status")
			}
	}

	const getLikeNum = async () => {
		const res = await fetch(ROOT_URL + '/blurt/like/' + props.id  + '/list', {
			method: 'GET'
		})
		const data = await res.json()
		if(res.ok){
			if(data["no_of_likes"] === 0){
				setLikesNum('')
			}else{
				setLikesNum(data["no_of_likes"])
			}
		}else{
			setLikesNum('')
		}
	}

	const updateLike = async (blurt_id, accessToken) => {
		const res = await fetch(ROOT_URL + '/blurt/like/' + blurt_id,{
			method: "POST",
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		const data = await res.json()
		if(res.ok){
			return true
		}else{
			return false
		}
	}

	const changeLikeBtn = async (e) => {
		e.preventDefault()
		// If blurt is liked
		if (likeBtn === heartGreyOutline){
			const res = updateLike(props.id, props.accessToken)
			if (res){
				setLikeBtn(heartRed)
				setLikesNum(likesNum + 1)
			}
		} 
		//  If blurt is unliked
		else if (likeBtn === heartRed){
			const res = updateLike(props.id, props.accessToken)
			if (res){
				setLikeBtn(heartGreyOutline)
				setLikesNum(likesNum - 1)
			}
		}
	}

	return (
		<div className="blurt-card">
			<div className="pfp-container">
			</div>
			<div className="blurt-container-right">
				<div className="blurt-body">
					<div className="blurt-body-header">
						<div className="display-name"><p>{props.display_name}</p></div>
						<div className="username"><p>@{props.username}</p></div>
						<div className="timestamp"><p>{dateDifference(props.created_at)}</p></div>
					</div>
					<div className="blurt-content"><p>{props.content}</p></div>
				</div>
				<div className="blurt-footer">
					<div className="blurt-likes">
						<img src={likeBtn} onClick={changeLikeBtn} width="22" height="22"/>
						<span>{likesNum}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BlurtCard