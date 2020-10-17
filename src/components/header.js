import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faUserCircle } from "@fortawesome/free-regular-svg-icons"
import { Link } from "gatsby"
import headerStyles from "./header.module.css"
import scanatlogo from "../images/scan_at_logo_textless.png"
import { getCurrentUser, isLoggedIn } from "../utils/auth"

const Header = props => {

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
            {typeof getCurrentUser()["custom:page_id"] !== "undefined" &&
              getCurrentUser()["custom:page_id"].substring(0, 6) + ".. "}
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
