import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { navigate, Link } from "gatsby"
import headerStyles from "./header.module.css"
import scanatlogo from "../images/scan_at_logo.png"
import {getCurrentUser, logout, isLoggedIn} from '../utils/auth'
import { Auth } from "aws-amplify"

const Header = props => {
  const [subMenu, setSubMenu] = useState(false)

  const toggleSubmenu = () => {
    subMenu ? setSubMenu(false) : setSubMenu(true)
  }

  const logOut = async () => {
    await Auth.signOut()
    navigate('/')
  }


  return (
    <header className={headerStyles.head}>
      {/* <img
        className={headerStyles.logo}
        alt="Scan At Logo"
        src={scanatlogo}
        onClick={() => {
          navigate("/")
        }}
      /> */}
      <Link to='/'><h3 className={headerStyles.topic}>Scan At</h3></Link>

      <ul className={headerStyles.headerRightContainer}>
        {isLoggedIn() && (
          <li onClick={toggleSubmenu}>
            Welcome, {getCurrentUser().username}
            <FontAwesomeIcon
              icon={faCaretDown}
              color="white"
              size="sm"
              style={{ marginLeft: 5 }}
            />
            <ul style={{ display: subMenu ? "block" : "none" }}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">My Profile</Link>
              </li>
              <li onClick={() => logout(logOut)}>Logout</li>
            </ul>
          </li>
        )}
        {!isLoggedIn() && (
          <li>
            <section
              className={headerStyles.loginButton}
              style={{
                borderRadius: "20px",
                background: "rgba(0, 0, 0, 0.34)",
              }}
              onClick={props.onHandleLoginModal}
            >
              <FontAwesomeIcon icon={faUser} color="white" size="lg" />
            </section>
          </li>
        )}
      </ul>
    </header>
  )
}

export default Header
