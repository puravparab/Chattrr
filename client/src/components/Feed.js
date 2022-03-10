import { useState, useEffect } from 'react'
import BlurtCard from "./cards/BlurtCard"
import '../styles/components/feed.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const Feed = () => {
	const [BlurtList, setBlurtList] = useState('')

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
		const res = await fetch(ROOT_URL + '/blurt/list' ,{
			method: 'GET'
		})

		console.log(res)
		const data = await res.json()
		console.log(data)

		if (res.ok){
				const BlurtList = await data.map((blurtItem) =>{
					return <BlurtCard 
								username={blurtItem.username} 
								display_name={blurtItem.display_name}
								content={blurtItem.content} 
								created_at={blurtItem.created_at} />
				})
				console.log(BlurtList)
				setBlurtList(BlurtList)
		} else{
			console.log("blurts loading fail")
			// Remove
			setBlurtList(<h1>FAIL</h1>)
		}
	}

	return (
		<div className="feed-container">
			{BlurtList}
		</div>
	)
}

export default Feed