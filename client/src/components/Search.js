import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken, isAuthenticated, logout } from  "../actions/authActions.js"

import NoteIcon from '../assets/icons/note_white.svg';
import profileIcon from '../assets/icons/profile_icon_white2.svg'
import searchIcon from '../assets/icons/whitesearch.svg'
import defaultPFP from '../assets/images/default-pfp.png';
import '../styles/components/search.css';

const ROOT_URL = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port

const Search = (props) => {
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

	const [searchResults, setSearchResults] = useState('')
	const [searchBoxState, setSearchBoxState] = useState(false)

	useEffect(() =>{
		if(searchText != ''){
			setSearchResults('')
			Search()
			setSearchBoxState(true)
		}else{
			setSearchBoxState(false)
		}
	}, [searchText])

	const handleText = (e) => {
		if (searchFilter != '' && inputFocus === true){
			setSearchtext(e.target.value.trim())
		}
	}

	const handleImageSrc = (image) => {
		if(image === null){
			return defaultPFP
		}else{
			return image
		}
	}

	// Call Search API
	const Search = async () => {
		try{
			const res = await fetch(ROOT_URL + '/api/search/' + searchFilter + '?' + new URLSearchParams({
				q: searchText,
			}), {
				method: 'GET',
				headers: {
					'Content-type': 'application/json'
				}
			})
			const data = await res.json()
			if (res.ok){
				const searchData = await data.users.map((user) =>{
					const image = handleImageSrc(user.profile_image)
					return (
						<div className="search-results-card" onClick={()=>{
							{props.profilePage && window.location.replace(`../user/${user.username}`)}
							{!props.profilePage && navigate(`../user/${user.username}`)}	
						}}>
							<img src={image} width="48" height="48" alt="user image"/>
							<div className="user-detail">
								<p className="username">{user.display_name}</p>
								<p className="display-name">@{user.username}</p>
							</div>
						</div>
					)
				})
				setSearchResults(searchData)
			}else{
				setSearchResults(
					<div className="search-error">
						<p>No {searchFilter} found</p>
					</div>
				)
			}
		} catch(e){
			setSearchResults(
				<div className="search-error">
					<p>No {searchFilter} found</p>
				</div>
			)
		}
	}

	// When users hovers in and out of the searchbar
	const handleSearchActive = (state) => {
		if(state){
			setSearchActive(true)
			setInputFocus(true)
		}else{
			setSearchActive(false)
			setInputFocus(false)
			setSearchtext('')
			setSearchFilter('')
			setSearchBoxState(false)
		}
	}

	// When users focus in or out of the search input
	const handleInputFocus = (state) => {
		if(state){
			setInputFocus(true)
		}
	}

	return (
		<div 
			className="search-container" 
			onMouseEnter={() => {handleSearchActive(true)}}
			onMouseLeave={() => {handleSearchActive(false)}}
		>
			<div className={searchActive? "search-bar active" : "search-bar"}>
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
						<img className={searchFilter === 'blurt'? "active-img" : ""} 
							src={NoteIcon} width="22" height="22" alt="home button" 
							onClick={()=>{ 
								setSearchFilter('blurt')
							}}
						/>
						<img className={searchFilter === 'user'? "active-img" : ""} 
							src={profileIcon} width="22" height="22" alt="user button" 
							onClick={()=>{ 
								setSearchFilter('user')
							}}
						/>
					</div>
				}
			</div>

			{searchBoxState && 
				<div className="search-results-container">
					{searchResults}
				</div>
			}
		</div>	
	)
}

export default Search