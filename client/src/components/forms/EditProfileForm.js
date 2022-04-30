import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated } from  "../../actions/authActions.js"
import '../../styles/components/forms/editprofileform.css';
import alertRed from '../../assets/icons/alert_red.svg';
import crossWhite from '../../assets/icons/cross_white.svg';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const EditProfileForm = (props) => {
	const [accessToken, setAccessToken] = useState(props.accessToken)
	const [display_name, setDisplayName] = useState('')
	const [profile_image, setProfileImage] = useState('')
	const [profile_image_file, setProfileImageFile] = useState('')
	const [bio, setBio] = useState('')
	const [error, setError] = useState('')

	let navigate = useNavigate();

	// Check if access token is valid
	const authCheck = () => {
		try{
			const access_token = getToken('at')
			setAccessToken(access_token)
		} catch(e){
			console.log(e)
			const res = isAuthenticated()
			if(res === false){
				window.location.replace('/')
			}
		}
	}

	const handleDisplayName = (e) => {
		setDisplayName(e.target.value)
	}

	const handleProfileImage = (e) => {
		setProfileImageFile(e.target.files[0])
	}

	const handleBio = (e) => {
		setBio(e.target.value)
	}

	const resetState = () =>{
		setDisplayName('')
		setProfileImage('')
		setProfileImageFile('')
		setBio('')
		setError('')
		props.handleEditModel(true)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		authCheck()
		const formData = new FormData();
		if(display_name === '' && profile_image_file === '' && bio === ''){
			setError('Fields empty')
		}
		else{
			if (display_name !== ''){
				formData.append('display_name', display_name);
			}
			if (profile_image_file !== ''){
				formData.append('profile_image', profile_image_file);
			}
			if (bio !== ''){
				formData.append('bio', bio);
			}
			const res = await fetch(ROOT_URL + '/accounts/edit',{
				method: 'POST',
				headers: {
					'Authorization': "Bearer " + accessToken
				},
				body: formData
			})
			const data = await res.json()

			if (res.ok){
				resetState()
				navigate('/')
			}else{
				setError('Update Failed')
			}
		}
	}

 	return (
		<div className="edit-profile-container">
			<div className="header">
				<h4>Edit Profile</h4>
				<img src={crossWhite} onClick={resetState} alt="close" width="20" height="20" />
			</div>
			{error !== ''? 
				<div className="error"><p>{error}</p></div> : ""
			}
			<div className="edit-profile-form">
				<form className="form">
					<div className="form-entry">
						<label className="label">Display Name</label>
						<input className="display-name" type="text" maxlength="40" onChange={handleDisplayName} value={display_name}/>
					</div>
					<div className="form-entry">
						<label className="label">Change Profile Picture</label>
						<input type="file" onChange={handleProfileImage} accept="image/*" />
					</div>
					<div className="form-entry">
						<label className="label">Update Bio</label>
						<textarea type="text" onChange={handleBio} value={bio} maxlength="160" wrap="hard" />
					</div>
					<button onClick={handleSubmit} className="btn-submit" type="submit">Save</button>
				</form>
			</div>
		</div>
	)
}

export default EditProfileForm