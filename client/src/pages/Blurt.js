import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken, isAuthenticated } from  "../actions/authActions.js"
import BlurtCard from "../components/cards/BlurtCard.js"
import BlurtComment from "../components/cards/BlurtComment.js"
import PostCommentForm from "../components/forms/PostCommentForm.js"
import '../styles/pages/homepage.css';
import '../styles/pages/blurt.css';
import backBtn from '../assets/icons/white_arrow.svg';

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
			getBlurt(params.id)
			getBlurtComments(params.id)
		}
		catch(e){
			console.log(e)
		}
	}, [])
  	
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
							created_at={data[0].created_at} 
							likes_detail={data[0].likes_detail}
							no_of_comments={data[0].no_of_comments}
							accessToken={accessToken} 
							renderComment={false} />
			setBlurt(Blurt)
 		}else{
 			console.log("Blurt does not exist")
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
  							content={blurtComment.content}
  							created_at={blurtComment.created_at}
  							likes_detail={blurtComment.likes_detail}
  							accessToken={accessToken} />
  			})
  			setBlurtComments(BlurtComments)
  		}else{
  			console.log("Blurt does not have any comments")
  		}
  	}

	return (
		<div className="home" >
			
			<div className="header">
				<img src={backBtn} alt="back-btn" width="30" height="30"
					onClick={()=> {
						navigate(-1)
					}} />
				<div className="title">
					<h1 onClick={()=> {
						navigate("/")
					}}>Chattrr</h1>
				</div>
			</div>
			<div className="blurt-page-container">
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
			</div>
			
		</div>
	)
}

export default Blurt;