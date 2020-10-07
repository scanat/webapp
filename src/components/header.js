import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBell,
  faUser,
  faUserCircle,
} from "@fortawesome/free-regular-svg-icons"
import { navigate, Link } from "gatsby"
import headerStyles from "./header.module.css"
import scanatlogo from "../images/scan_at_logo_textless.png"
import { getCurrentUser, logout, isLoggedIn } from "../utils/auth"
import { Auth } from "aws-amplify"

const Header = props => {
  const [name, setName] = useState("")

  useEffect(() => {
    isLoggedIn() &&
      typeof getCurrentUser().name !== "undefined" &&
      setName(getCurrentUser().name)
  }, [])

  useEffect(() => {
    loged()
    async function loged() {
      try {
        await Auth.currentAuthenticatedUser()
      } catch (error) {}
    }
  }, [])

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
        <li id="dropDownParent" className={headerStyles.dropDownParent}>
          <Link to={isLoggedIn() ? "/profile/" : "/login/"}>
            {name.split(" ")[0] + " "}
            <FontAwesomeIcon
              icon={faUserCircle}
              style={{ width: "30px" }}
              color="white"
              size="lg"
            />
          </Link>
        </li>
      </ul>
    </header>
  )
}

export default Header
