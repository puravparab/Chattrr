const BlurtCard = (props) => {
	return (
		<div className="blurt-card">
			<div className="pfp-container">
			</div>
			<div className="blurt-body">
				<div className="blurt-body-header">
					<div><p>{props.display_name}</p></div>
					<div><p>@{props.username}</p></div>
					<div><p>{props.created_at}</p></div>
				</div>
				<div className="blurt-content"><p>{props.content}</p></div>
			</div>
		</div>
	)
}

export default BlurtCard