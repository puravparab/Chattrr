import crossWhite from '../assets/icons/cross_white.svg';
import '../styles/pages/imageview.css';

const ImageView = (props) => {
	return (
		<div className="image-page">
			<div className="image-page-header">
				<img src={crossWhite} onClick={props.handleImageViewer} alt="close" width="30" height="30" />
			</div>
			<div className="image-container">
				<img src={props.image} />
			</div>
		</div>
	)
}

export default ImageView