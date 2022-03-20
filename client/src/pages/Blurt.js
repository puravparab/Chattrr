import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import BlurtCard from "../components/cards/BlurtCard.js"
import BlurtComment from "../components/cards/BlurtComment.js"
import '../styles/pages/homepage.css';

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

	useEffect(()=>{
		try{
			getBlurt(params.id, params.username)
			getBlurtComments(params.id)
		}
		catch(e){
			console.log(e)
		}
	}, [])
  	
  	// Get Blurt Details
  	const getBlurt = async (blurt_id, username) => {
 		const res = await fetch(ROOT_URL + '/blurt/' + blurt_id, {
 			method: "GET"
 		})
 		const data = await res.json()
 		console.log(data)
 		if(res.ok){
 			const Blurt = <BlurtCard
							id={blurt_id}
							username={username} 
							display_name={data[0].display_name}
							content={data[0].content} 
							created_at={data[0].created_at} 
							accessToken={accessToken} />
			setBlurt(Blurt)
 		}else{
 			console.log("Blurt does not exist")
 		}
  	}

  	// Get List of comments
  	const getBlurtComments = async (blurt_id) => {
  		const res = await fetch(ROOT_URL + '/blurt/comment/' + blurt_id.toString() + '/list', {
  			method: 'GET'
  		})

		const data = await res.json()
		console.log(data)

  		if (res.ok){
  			const BlurtComments = await data.comments.map((blurtComment) => {
  				return <BlurtComment 
  							id={blurtComment.id}
  							blurt_id={blurtComment.blurt_id}
  							author={blurtComment.author}
  							content={blurtComment.content}
  							created_at={blurtComment.created_at}
  							accessToken={accessToken} />
  			})
  			setBlurtComments(BlurtComments)
  		}else{
  			console.log("Blurt does not have any comments")
  		}
  	}

	return (
		<div className="home" >
			<div className="title" onClick={()=> {
				navigate("/")
			}}>
				<h1>Chattrr</h1>
			</div>
			<div className="home-container">
				<div className="home-container-center">
					<div className="blurt-container">
						{Blurt}
					</div>
					<div className="comments-container">
						{blurtComments}
					</div>
				</div>
			</div>
			
		</div>
	)
}

export default Blurt;