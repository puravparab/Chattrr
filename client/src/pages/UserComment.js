import { useParams } from "react-router-dom"

const UserCOmment = () => {
	let params = useParams()
  	console.log(params.id)
	return (
		<div>
			<h1>USER {params.id}</h1>
		</div>
	)
}

export default UserCOmment;