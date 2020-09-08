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
      <Link to='/'><h3 className={headerStyles.topic}>Scan At</h3></Link>

      <ul className={headerStyles.headerRightContainer}>
        {isLoggedIn() && (
          <li className={headerStyles.dropDownParent} onClick={toggleSubmenu}>
            Welcome, {String(getCurrentUser().name).split(" ")[0]}
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
              <label style={{fontSize: 14, marginLeft: 5}}>Login</label>
            </section>
          </li>
        )}
      </ul>
    </header>
  )
}

export default Header
