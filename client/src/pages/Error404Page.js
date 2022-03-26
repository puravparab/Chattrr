import React from 'react'

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const Error404Page = () => {
	return (
		<div>
			<h2>Error 404: Sorry, this page isn't available.</h2>
			<p>The link you followed may be broken, or the page may have been removed. 
				<span onClick={()=> {
					window.location.replace(ROOT_URL)
				}}>
					Go back to Home.
				</span>
			</p>
		</div>
	);
}

export default Error404Page;