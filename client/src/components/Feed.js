import { useState, useEffect } from 'react'
import BlurtCard from "./cards/BlurtCard"
import '../styles/components/feed.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const Feed = ({ accessToken, renderComment }) => {
	const [BlurtList, setBlurtList] = useState('')
	const [blurtData, setBlurtData] = useState('')
	const [blurtIndex, setBlurtIndex] = useState(0)

	const [loadState, setLoadState] = useState(true)

	useEffect(() => {
		//Attempt to retreive data
		try {
			getBlurtList()
		}
		// TODO: Test This
		catch (e) {
			console.log(e)
		}
	}, [blurtIndex])

	const handleLoadBlurts = () =>{
		let index = blurtIndex
		setBlurtIndex(index + 1)
	}

	const getBlurtList = async () =>{
		const res = await fetch(ROOT_URL + '/blurt/list?' + new URLSearchParams({
			index: blurtIndex,
		}),{
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			}
		})
		const data = await res.json()

		if (res.ok){
			if(data.no_of_blurts === 0){
				setLoadState(false)
			}else{
				let list = {}
				if(blurtIndex === 0){
					list = data
					setBlurtData(data)
				}else{
					list = blurtData
					for (let i = 0; i < data.blurts.length; i++) {
						list.blurts.push(data.blurts[i])
					}
					list["no_of_blurts"] = blurtData.no_of_blurts + data.no_of_blurts
					setBlurtData(list)
				}

				const newBlurtList = await list.blurts.map((blurtItem) =>{
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
								accessToken={accessToken} 
								renderComment={renderComment} 
								is_user_author={blurtItem.is_user_author} />
				})
				setBlurtList(newBlurtList)
			}
		} else{
			setBlurtList(<h1>Error</h1>)
		}
	}

	return (
		<div className="feed-container">
			{BlurtList}
			{loadState && <button onClick={handleLoadBlurts}>More Blurts</button>}
		</div>
	)
}

export default Feed