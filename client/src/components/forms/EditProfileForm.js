import '../../styles/components/forms/editprofileform.css';
import alertRed from '../../assets/icons/alert_red.svg';

const EditProfileForm = (props) => {
	return (
		<div className="edit-profile-container">
			<div className="header">
				<h4>Edit Profile</h4>
				<img src={alertRed} onClick={props.handleEditModel} alt="close" width="20" height="20" />
			</div>
			<div className="edit-profile-form">
				<form className="form">
					<div className="form-entry">
						<label className="label">Display Name</label>
						<input type="text" />
					</div>
					<div className="form-entry">
						<label className="label">Change Profile Picture</label>
						<input type="file"/>
					</div>
					<div className="form-entry">
						<label className="label">Update Bio</label>
						<input type="text" />
					</div>
				</form>
			</div>
		</div>
	)
}

export default EditProfileForm