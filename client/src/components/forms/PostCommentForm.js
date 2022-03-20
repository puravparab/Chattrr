import { useState } from 'react'
import { isAuthenticated } from  "../../actions/authActions.js"
import '../../styles/components/forms/postcommentform.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// TODO: Fix Auth check before fetch
// TODO: Allow variety of text inputs
// TODO: prohibit submit on enter btn click
// TODO: Character limit warning

const PostCommentForm = ({ accessToken, blurt_id}) => {
	const [comment, setComment] = useState('')

	const handleComment = (e) =>{
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

	return(
		<div className="post-comment">
			<form className="form">
				<input onChange={handleComment} placeholder="Reply..." required/>
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