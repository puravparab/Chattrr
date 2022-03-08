import { useState, useEffect } from 'react'
import { getToken, isAuthenticated } from  "../actions/authActions.js"

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const HomePage = () => {
	const [accessToken, setAccessToken] = useState(() => {
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
	const [refreshToken, setRefreshToken] = useState(() => {
		try{
			const refresh_token = getToken('rt')
			console.log(refresh_token)
			return refresh_token
		} catch(e){
			console.log(e)
			window.location.replace('/')
		}
	})

	const [blurt, setBlurt] = useState('')
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

	const getBlurtList = async () =>{
		const res = await fetch(ROOT_URL + '/blurt/list' ,{
			method: 'GET'
		})

		console.log(res)
		const data = await res.json()
		console.log(data)

		if (res.ok){
				const BlurtList = await data.map((blurtItem) =>{
					return <div>
								<p>{blurtItem.content} - {blurtItem.username}</p>  
							</div>;
				})
				console.log(BlurtList)
				setBlurtList(BlurtList)
		} else{
			console.log("blurts loading fail")
			setBlurtList( <h1>FAIL</h1>)
		}
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

			<div>
				<h3>Feed</h3>
				<div>{BlurtList}</div>
			</div>
		</div>
	);
}

export default HomePage;