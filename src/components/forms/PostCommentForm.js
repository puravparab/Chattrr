import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from  "../../actions/authActions.js"
import '../../styles/components/forms/postcommentform.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// TODO: Fix Auth check before fetch
// TODO: Allow variety of text inputs

const PostCommentForm = ({ accessToken, blurt_id}) => {
	const [comment, setComment] = useState('')
	let navigate = useNavigate();

	const handleComment = (e) =>{
		// Auto resize textarea
		const height = e.target.scrollHeight; 
		const rowHeight = 22; 
		const trows = Math.floor(height / rowHeight) - 1; 
		e.target.style.height = (22 * trows) + 'px'
		// Update blurt value
		setComment(e.target.value)
	}

	// Send request to create a blurt
	const createComment = async (e) => {
		e.preventDefault()

		const res = await fetch(ROOT_URL + '/blurt/comment/' + blurt_id ,{
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'Authorization': "Bearer " + accessToken
			},
			body: JSON.stringify({
				"content": comment
			})
		})

		const data = await res.json()

		if (res.ok) {
			navigate(0)
		}else{
			if(res.status === 401){
				console.log("accessToken invalid")
				const res = isAuthenticated()
			}
		}	
	}

	return(
		<div className="post-comment">
			<form className="form">
				<textarea onChange={handleComment} placeholder="Reply..." maxlength="250" wrap="hard" required/>
				<div className="footer">
					{comment.trim().length !== 0 ? 
						<button	onClick={createComment} type="submit">Post</button> :
						<button onClick={(e)=>{
											e.preventDefault()
											setComment('')}
										} 
							className="inactive" type="submit">Post</button>
					}
				</div>
			</form>
		</div>
	);
}

export default PostCommentForm