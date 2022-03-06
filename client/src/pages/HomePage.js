import { useState } from 'react'

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const HomePage = () => {
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
				'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ2NTMxNzQ1LCJpYXQiOjE2NDY1MjQ1NDUsImp0aSI6Ijc5NWZlYjMyMDNmNjRlODY4OThjODVhMThkZGI1ZTM5IiwidXNlcl9pZCI6MzF9.RQDSIVYACrjwkN2-p18iUZ6cHGtvip-EqcULtQ6uhbA"
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
			<h1>Home Page</h1>

			<div>
				<form>
					<h3>Create Blurt</h3>
					<input onChange={handleBlurt} required/>
					<button onClick={createBlurt} type="submit"> Blurt Out</button>
				</form>
			</div>
		</div>
	);
}

export default HomePage;