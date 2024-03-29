const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

// Get access and refresh token from cokkies if they exist
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
		throw e
	}
};

// Update valid Refresh token if Access token is invalid
const updateAcessToken = async (refresh_token) => {
	try{
		const res = await fetch(ROOT_URL + '/accounts/token/refresh/' + refresh_token, {
			method: 'GET'
		})
		const data = await res.json()
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
			return false
		}
	} catch(e){
		return false
	}
};

// Get tokens from cookies or update cookies if they do not exist
export const isAuthenticated = () => {
	// Get auth tokens from cookies
	try{
		const access_token = getToken('at')
		return true
	} catch(e){
		// Access token invalid
		try{
			const refresh_token = getToken('rt')
			updateAcessToken(refresh_token)
		} catch(e){
			// Refresh token invalid
			return false
		}
	}
};

// Logout user
export const logout = async () => {
	let refresh_token = ""

	// Get refresh token
	try{
		refresh_token = getToken('rt')
	}
	catch(e){
	}

	try{
		document.cookie = "at=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "rt=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	}catch(e){
		return false
	}
	
	if (refresh_token === ''){window.location.replace(ROOT_URL)}

	const res = await fetch(ROOT_URL + '/accounts/logout', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			"refresh_token": refresh_token
		})
	})
	if(res.ok){
		window.location.replace(ROOT_URL)
	}
}