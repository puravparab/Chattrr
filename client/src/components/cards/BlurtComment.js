import '../../styles/components/cards/blurtcomment.css';

const BlurtComment = (props) => {
	return (
		<div className="comments-card">
			{props.content}
		</div>
	)
};

export default BlurtComment