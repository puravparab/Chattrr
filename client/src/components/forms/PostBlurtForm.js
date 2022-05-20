import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from  "../../actions/authActions.js"

import ImageIcon from '../../assets/icons/image_icon_white.svg'
import '../../styles/components/forms/postblurtform.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// TODO: Fix Auth check before fetch
// TODO: Allow variety of text inputs
// TODO: prohibit submit on enter btn click
// TODO: Character limit warning

const PostBlurtForm = ({ accessToken }) =>{
	const [blurt, setBlurt] = useState('')
	const [image, setImage] = useState('')
	let navigate = useNavigate()

	const handleBlurt = (e) =>{
		// Auto resize textarea
		const height = e.target.scrollHeight; 
		const rowHeight = 22; 
		const trows = Math.floor(height / rowHeight) - 1; 
		e.target.style.height = (22 * trows) + 'px'
		// Update blurt value
		setBlurt(e.target.value)
	}

	const handleImage = (e) => {
		setImage(e.target.files[0])
	}

	// Send request to create a blurt
	const createBlurt = async (e) => {
		e.preventDefault()

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

		const data = await res.json()

		if (res.ok) {
			navigate('/')
		}else{
			if(res.status === 401){
				const res = isAuthenticated()
			}
		}	
	}

	return (
		<div className="post-blurt-container">
			<form className="form">
				<textarea onChange={handleBlurt} placeholder="What's on your mind?" maxlength="250" wrap="hard" required/>
				<div className="footer">
					<div className="post-blurt-options">
						<div className="option-item">
							<label for="files">
								<img src={ImageIcon} width="30" height="30" alt="image icon" />
							</label>
							<input id="files" type="file" onChange={handleImage} accept="image/*"/>
						</div>
					</div>

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