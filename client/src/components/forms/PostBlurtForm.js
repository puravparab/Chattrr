import { useState } from 'react'
import { isAuthenticated } from  "../../actions/authActions.js"
import '../../styles/components/forms/postblurtform.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// TODO: Fix Auth check before fetch
// TODO: Allow variety of text inputs
// TODO: prohibit submit on enter btn click
// TODO: Character limit warning

const PostBlurtForm = ({ accessToken }) =>{
	const [blurt, setBlurt] = useState('')

	const handleBlurt = (e) =>{
		setBlurt(e.target.value)
	}

	// Send request to create a blurt
	const createBlurt = async (e) => {
		e.preventDefault()
		console.log(blurt)

		const res = await fetch(ROOT_URL + '/blurt/create' ,{
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			},
			body: JSON.stringify({
				"content": blurt
			})
		})

		console.log(res)
		const data = await res.json()
		console.log(data)

		if (res.ok) {
			console.log("ok")
		}else{
			if(res.status === 401){
				console.log("accessToken invalid")
				const res = isAuthenticated()
			}
		}	
	}

	return (
		<div className="post-blurt-container">
			<form className="form">
				<input onChange={handleBlurt} placeholder="What's on your mind?" required/>
				<div className="footer">
					{blurt.trim().length !== 0 ? 
						<button	onClick={createBlurt} type="submit"> Blurt Out</button> :
						<button onClick={(e)=>{
											e.preventDefault()
											setBlurt('')}
										} 
							className="inactive" type="submit">Blurt Out</button>
					}
				</div>
			</form>
		</div>
	);
}

export default PostBlurtForm