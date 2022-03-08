import { useState } from 'react'

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const PostBlurtForm = ({ accessToken }) =>{
	const [blurt, setBlurt] = useState('')

	const handleBlurt = (e) =>{
		setBlurt(e.target.value)
	}

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
	}

	return (
		<div>
			<form>
				<h3>Create Blurt</h3>
				<input onChange={handleBlurt} required/>
				<button onClick={createBlurt} type="submit"> Blurt Out</button>
			</form>
		</div>
	);
}

export default PostBlurtForm