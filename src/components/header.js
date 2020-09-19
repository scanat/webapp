import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faUserCircle } from "@fortawesome/free-regular-svg-icons"
import { navigate, Link } from "gatsby"
import headerStyles from "./header.module.css"
import scanatlogo from "../images/scan_at_logo_textless.png"
import { getCurrentUser, logout, isLoggedIn } from "../utils/auth"
import { Auth } from "aws-amplify"
import {
  faEllipsisV,
  faSignOutAlt,
  faHome,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons"

const Header = props => {
  const [subMenu, setSubMenu] = useState(false)
  const [user, setUser] = useState({})

  useEffect(() => {
    document
      .getElementById("dropDownParent")
      .addEventListener("toggle", toggleSubmenu)
  }, [subMenu])

  useEffect(() => {
    setUser()
  }, [getCurrentUser()])

  const toggleSubmenu = () => {
    subMenu ? setSubMenu(false) : setSubMenu(true)
  }

  const logOut = async () => {
    await Auth.signOut()
    navigate("/")
  }

  return (
    <header className={headerStyles.head}>
      <Link to="/">
        <img
          className={headerStyles.logo}
          src={scanatlogo}
          alt="Scan At Logo White"
        />
      </Link>
      <h3 className={headerStyles.topic}>Scan At</h3>

      <ul className={headerStyles.headerRightContainer}>
        <li id="dropDownParent" className={headerStyles.dropDownParent}>
          <FontAwesomeIcon
            icon={isLoggedIn() ? faUserCircle : faEllipsisV}
            style={{ width: "20px" }}
            color="#169188"
            size="lg"
          />
          <ul
            className={headerStyles.submenu}
            style={{ display: subMenu ? "block" : "none" }}
          >
            <li>
              <Link to="/">
                Home{" "}
                <FontAwesomeIcon icon={faHome} style={{ marginLeft: "5px" }} />
              </Link>
            </li>
            <li>
              <Link to={isLoggedIn() ? "/profile" : "/"}>
                {isLoggedIn()
                  ? String(getCurrentUser()["custom:nick_name"]).split(" ")[0]
                  : "Profile"}
                <FontAwesomeIcon icon={faUser} style={{ marginLeft: "5px" }} />
              </Link>
            </li>
            {isLoggedIn() ? (
              <li
                onClick={() => logout(logOut)}
                onMouseUp={() => logout(logOut)}
              >
                Logout{" "}
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  style={{ marginLeft: "5px" }}
                />
              </li>
            ) : (
              <li
                onClick={props.onHandleLoginModal}
                onMouseUp={props.onHandleLoginModal}
              >
                Login{" "}
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  style={{ marginLeft: "5px" }}
                />
              </li>
            )}
          </ul>
        </li>
      </ul>
    </header>
  )
}

export default Header
