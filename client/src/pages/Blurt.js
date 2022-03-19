import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken, isAuthenticated } from  "../actions/authActions.js"
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

	const [blurtComments, setBlurtComments] = useState('')

	useEffect(()=>{
		try{
			getBlurtComments(params.id)
		}
		catch(e){
			console.log(e)
		}
	}, [])
  	
  	const getBlurtComments = async (blurt_id) => {
  		const res = await fetch(ROOT_URL + '/blurt/comment/' + blurt_id.toString() + '/list', {
  			method: 'GET'
  		})

		const data = await res.json()
		console.log(data)

  		if (res.ok){
  			setBlurtComments(data)
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
			<div user-blurt-page>
				<h1>USER: {params.username} - {params.id}</h1>
			</div>
			
		</div>
	)
}

export default Blurt;