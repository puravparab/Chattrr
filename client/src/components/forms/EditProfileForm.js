import { useState } from 'react';
import '../../styles/components/forms/editprofileform.css';
import alertRed from '../../assets/icons/alert_red.svg';

const EditProfileForm = (props) => {
	const [display_name, setDisplayName] = useState('')
	const [profile_image, setProfileImage] = useState('')
	const [bio, setBio] = useState('')

	const handleDisplayName = (e) => {
		setDisplayName(e.target.value)
	}

	const handleProfileImage = (e) => {
		setProfileImage(e.target.value)
		console.log(e.target.value)
	}

	const handleBio = (e) => {
		setBio(e.target.value)
	}

	const resetState = () =>{
		setDisplayName('')
		setProfileImage('')
		setBio('')
		props.handleEditModel(true)
	}

 	return (
		<div className="edit-profile-container">
			<div className="header">
				<h4>Edit Profile</h4>
				<img src={alertRed} onClick={resetState} alt="close" width="20" height="20" />
			</div>
			<div className="edit-profile-form">
				<form className="form">
					<div className="form-entry">
						<label className="label">Display Name</label>
						<input className="display-name" type="text" onChange={handleDisplayName} value={display_name}/>
					</div>
					<div className="form-entry">
						<label className="label">Change Profile Picture</label>
						<input type="file" onChange={handleProfileImage} value={profile_image}/>
					</div>
					<div className="form-entry">
						<label className="label">Update Bio</label>
						<textarea type="text" onChange={handleBio} value={bio} maxlength="160" wrap="hard" />
					</div>
				</form>
			</div>
		</div>
	)
}

export default EditProfileForm