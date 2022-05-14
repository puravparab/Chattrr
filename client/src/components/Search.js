import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import homeBtn from '../assets/icons/home_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import searchIcon from '../assets/icons/whitesearch.svg'
import '../styles/components/search.css';

const Search = () => {
	let navigate = useNavigate();

	// Get Access Token
	const [accessToken] = useState(() => {
		try{
			const access_token = getToken('at')
			console.log(access_token)
			return access_token
		} catch(e){
			console.log(e)
			const res = isAuthenticated()
			console.log(res)
			window.location.replace('/')
		}
	})

	const [searchText, setSearchtext] = useState('')
	const [searchFilter, setSearchFilter] = useState('')

	const [searchActive, setSearchActive] = useState(false)
	const [inputFocus, setInputFocus] = useState(false)

	const handleText = (e) => {
		if (searchFilter != ''){
			setSearchtext(e.target.value)
		}
	}

	const handleSearchActive = (state) => {
		if(state){
			setSearchActive(true)
		}
		else{
			if(!inputFocus){
				setSearchActive(false)
				setSearchtext('')
				setSearchFilter('')
			}
		}
	}
	const handleInputFocus = (state) => {
		if(state){
			setSearchActive(true)
			setInputFocus(true)
		}else{
			setSearchActive(false)
			setInputFocus(false)
			setSearchtext('')
			setSearchFilter('')
		}
	}

	return (
		<div className="search-container">
			<div 
				className={searchActive? "search-bar active" : "search-bar"} 
				onMouseEnter={() => {handleSearchActive(true)}}
				onMouseLeave={() => {handleSearchActive(false)}}
			>
				<div className="search-bar-input">
					<img src={searchIcon} width="18" height="18" />
					<input
						onChange={handleText}
						value={searchText}
						placeholder="Search Chattrr"
						onFocus={() =>{handleInputFocus(true)}}
						onBlur={() => {handleInputFocus(false)}} />
				</div>
				{searchActive &&	
					<div className="search-options">
						<img className={searchFilter === 'User'? "active-img" : ""} 
							src={profileIcon} width="22" height="22" alt="user button" 
							onClick={()=>{ 
								setSearchFilter('User')
							}}
						/>
						<img className={searchFilter === 'Blurt'? "active-img" : ""} 
							src={homeBtn} width="22" height="22" alt="home button" 
							onClick={()=>{ 
								setSearchFilter('Blurt')
							}}
						/>
					</div>
				}
			</div>
		</div>	
	)
}

export default Search