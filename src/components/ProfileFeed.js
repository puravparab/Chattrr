import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurtCard from "./cards/BlurtCard"
import '../styles/components/feed.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const ProfileFeed = (props) =>{
	const [BlurtList, setBlurtList] = useState('')
	let navigate = useNavigate();

	useEffect(() => {
		//Attempt to retreive data
		try {
			getBlurtList()
		}
		// TODO: Test This
		catch (e) {
			console.log(e)
		}
	}, [])

	const getBlurtList = async () =>{
		const res = await fetch(ROOT_URL + '/accounts/' + props.username + '/blurts' ,{
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + props.accessToken
			}
		})
		const data = await res.json()
		if (res.ok){
			const BlurtList = await data.blurts.map((blurtItem) =>{
				return <BlurtCard
							id={blurtItem.id}
							username={blurtItem.username} 
							display_name={blurtItem.display_name}
							content={blurtItem.content}
							profile_image={blurtItem.profile_image}
							image={blurtItem.image} 
							created_at={blurtItem.created_at} 
							likes_detail={blurtItem.likes_detail}
							no_of_comments={blurtItem.no_of_comments}
							accessToken={props.accessToken} 
							renderComment={props.renderComment} 
							is_user_author={data.is_user}/>
			})
			if(BlurtList.length !== 0){
				setBlurtList(BlurtList)
			}
			else{
				setBlurtList(
					<div className="empty-card">
						<p> No Blurts yet</p>
					</div>
				)
			}
		} else{
			setBlurtList(
				<div className="empty-card">
					<p> No Blurts yet</p>
				</div>
			)
		}
	}

	return (
		<div className="feed-container">
			{BlurtList}
		</div>
	)
}

export default ProfileFeed