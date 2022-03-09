import '../../styles/components/cards/blurtcard.css';

const BlurtCard = (props) => {
	const splitISO = (ISODateTime) =>{
		const dateTime = (ISODateTime.split("Z"))[0].split("T")

		// Parse date
		const date = dateTime[0].split("-")
		const month = date[1]
		const dateTimeStr = (new Date(ISODateTime)).toDateString().split(" ")

		// Parse time
		const time = dateTime[1].split(":")
		const hour = time[0]
		const minute = time[1]
		const seconds = time[2]

		return [[dateTimeStr[3], month, dateTimeStr[1], dateTimeStr[2], dateTimeStr[0]],
				[hour, minute, seconds]]
	}

	const dateDifference = (postDate) =>{
		// console.log("rawdate:" + postDate)
		const postDateStr = (new Date(postDate)).toDateString()
		// console.log(postDateStr)

		const currentTimeISO = (new Date()).toISOString()
		// console.log("current time:" + currentTimeISO)

		const currDateTime = splitISO(currentTimeISO)
		const postDateTime = splitISO(postDate)

		// console.log("c: " + currDateTime)
		// console.log("p: " + postDateTime)

		const yearDiff = currDateTime[0][0] - postDateTime[0][0]
		// If post is older than a year
		if (yearDiff > 0){
			// monthName day, year
			return (postDateTime[0][2] + " " + postDateTime[0][3] + ", " + postDateTime[0][0])
		}
		else{
			// If post is older than a month
			if(currDateTime[0][2] !== postDateTime[0][2]){
				// monthName day
				return (postDateTime[0][2] + " " + postDateTime[0][3])
			}
			else{
				// If post is older than day
				if(currDateTime[0][3] !== postDateTime[0][3]){
					// monthName day
					return (postDateTime[0][2] + " " + postDateTime[0][3])
				}
				else{
					// If post is older than an hour
					const hourDiff = currDateTime[1][0] - postDateTime[1][0]
					if(hourDiff !== 0){
						return (hourDiff + "h")
					}
					else{
						// IF post is older than the minute
						const minDiff = currDateTime[1][1] - postDateTime[1][1]
						if(minDiff !== 0){
							return (minDiff + "m")
						}
						else{
							const secondDiff = Math.ceil(currDateTime[1][2] - postDateTime[1][2])
							return (secondDiff + "s")
						}
					}
				}
			}
		}
	}

	return (
		<div className="blurt-card">
			<div className="pfp-container">
			</div>
			<div className="blurt-body">
				<div className="blurt-body-header">
					<div><p>{props.display_name}</p></div>
					<div><p>@{props.username}</p></div>
					<div><p>{dateDifference(props.created_at)}</p></div>
				</div>
				<div className="blurt-content"><p>{props.content}</p></div>
			</div>
		</div>
	)
}

export default BlurtCard