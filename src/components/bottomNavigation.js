import { faWpexplorer } from "@fortawesome/free-brands-svg-icons"
import { faHome, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { navigate } from "gatsby"
import React, { useEffect, useRef, useState } from "react"
import bottomNavStyles from "./bottomNavigation.module.css"

const BottomNavigation = () => {
  const [activePage, setActivePage] = useState("home")

  useEffect(() => {
    const queryString = window.location.pathname
    queryString === '/' && setActivePage('home')
    queryString === '/explore' && setActivePage('explore')
    queryString === '/profile' && setActivePage('profile')
  }, [])

  const setPage = page => {
    setActivePage(page)
    page === 'home' && navigate('/')
    page === 'explore' && navigate('/explore')
    page === 'profile' && navigate('/profile')
  }

  return (
    <nav>
      <ul>
        <li onClick={() => setPage("home")}>
          <FontAwesomeIcon icon={faHome} color="#169188" size="lg" />
          <label style={{color: activePage === 'home' ? '#169188' : 'black'}}>Home</label>
        </li>
        <li onClick={() => setPage("explore")}>
          <FontAwesomeIcon icon={faWpexplorer} color="#169188" size="lg" />
          <label style={{color: activePage === 'explore' ? '#169188' : 'black'}}>Explore</label>
        </li>
        <li onClick={() => setPage("profile")}>
          <FontAwesomeIcon icon={faUserCircle} color="#169188" size="lg" />
          <label style={{color: activePage === 'profile' ? '#169188' : 'black'}}>Profile</label>
        </li>
      </ul>
    </nav>
  )
}

export default BottomNavigation
