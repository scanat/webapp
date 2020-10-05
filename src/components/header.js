import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faUser, faUserCircle } from "@fortawesome/free-regular-svg-icons"
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
  faQrcode,
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

      <ul className={headerStyles.headerRightContainer}>
        <li id="dropDownParent" className={headerStyles.dropDownParent}>
          <Link to={isLoggedIn() ? "/profile" : "/login" }>
            {isLoggedIn() &&
              getCurrentUser().name !== "undefined" &&
              getCurrentUser().name.split(" ")[0] + " "}
            <FontAwesomeIcon
              icon={faUserCircle}
              style={{ width: "20px" }}
              color="white"
              size="lg"
            />
          </Link>
          {/* <ul
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
                  ? String(getCurrentUser().name).split(" ")[0]
                  : "Profile"}
                <FontAwesomeIcon icon={faUser} style={{ marginLeft: "5px" }} />
              </Link>
            </li>
            {isLoggedIn() ? (
              <li onClick={() => logout(logOut)}>
                Logout{" "}
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  style={{ marginLeft: "5px" }}
                />
              </li>
            ) : (
              <li onClick={props.onHandleLoginModal}>
                Login{" "}
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  style={{ marginLeft: "5px" }}
                />
              </li>
            )}
          </ul> */}
        </li>
        {/* <li>
          <Link to="/scanner">
            <FontAwesomeIcon
              icon={faQrcode}
              color="whitesmoke"
              style={{ width: "20px" }}
              size="lg"
            />
          </Link>
        </li> */}
        <li>
          <Link to="/notifications">
            <FontAwesomeIcon
              icon={faBell}
              color="whitesmoke"
              style={{ width: "30px" }}
              size="lg"
            />
          </Link>
        </li>
      </ul>
    </header>
  )
}

export default Header
