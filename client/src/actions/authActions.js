const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// Update valid Refresh token if Access token is invalid
const updateAcessToken = async (refresh_token) => {
	try{
		const res = await fetch(ROOT_URL + '/accounts/token/refresh/' + refresh_token, {
			method: 'GET'
		})

		console.log(res)
		const data = await res.json()
		console.log(data)

		if(res.ok){
			const access_token = data["tokens"]["access_token"]
			const refresh_token = data["tokens"]["refresh_token"]
			const at_expiry = data["expiry"]["at_tk_expiry"]
			const rt_expiry = data["expiry"]["rt_tk_expiry"]

			// token expiry into date time format
			var at_date = new Date();
			at_date.setTime(at_date.getTime() + (parseInt(at_expiry) * 1000))

			var rt_date = new Date();
			rt_date.setTime(rt_date.getTime() + (parseInt(rt_expiry) * 1000))

			// Add tokens to cookies
			document.cookie = "at=" + access_token + ";expires=" + at_date.toUTCString() + "; samesite=lax"
			document.cookie = "rt=" + refresh_token + ";expires=" + rt_date.toUTCString() + "; samesite=lax"
			window.location.replace('/')
		} else{
			// Refresh token invalid
			console.log(data)
			return false
		}
	} catch(e){
		console.log(e)
		return false
	}
};

export const getToken = (token_type) => {
	try{
		if(token_type === 'at'){
			let access_token = document.cookie.split('; ').find(row => row.startsWith('at')).split('=')[1]
			return access_token
		} else if (token_type === 'rt'){
			let refresh_token = document.cookie.split('; ').find(row => row.startsWith('rt')).split('=')[1]
			return refresh_token
		}
	} catch(e){
		console.log(e)
		throw e
	}
};

export const isAuthenticated = () => {
	// Get auth tokens from cookies
	try{
		const access_token = getToken('at')
		console.log(access_token)
		return true
	} catch(e){
		// Access token invalid
		console.log(e)
		try{
			const refresh_token = getToken('rt')
			console.log(refresh_token)
			updateAcessToken(refresh_token)
		} catch(e){
			// Refresh token invalid
			console.log(e)
			return false
		}
	}
};

