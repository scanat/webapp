import React, { useState } from "react"
import headerStyles from "./header.module.css"
import { faEllipsisV, faQrcode, faSignOutAlt, faHome } from "@fortawesome/free-solid-svg-icons"
import { faEdit, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { navigate, Link } from "gatsby"

const Navigation = () => {
  const [navOpen, setNavOpen] = useState(false)

  const openNavigation = () => {
    navOpen ? setNavOpen(false) : setNavOpen(true)
  }

  const logout = () => {
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('subscriberData')
    localStorage.removeItem('userData')
    navigate('/admin')
  }

  return (
    <ul className={headerStyles.adminNavigation}>
      <li onClick={openNavigation}>
        <FontAwesomeIcon icon={faEllipsisV} style={{ width: "20px" }} color='#169188' />
        <ul
          className={headerStyles.submenu}
          style={{ display: navOpen ? "block" : "none" }}
        >
          <li onClick={() => navigate('/admin')}>
            Home{" "}
            <FontAwesomeIcon icon={faHome} style={{ marginLeft: "5px" }} />
          </li>
          <li>
            Modify{" "}
            <FontAwesomeIcon icon={faEdit} style={{ marginLeft: "5px" }} />
          </li>
          <li>
            View <FontAwesomeIcon icon={faEye} style={{ marginLeft: "5px" }} />
          </li>
          <li>
            Activate QR{" "}
            <FontAwesomeIcon icon={faQrcode} style={{ marginLeft: "5px" }} />
          </li>
          <li onClick={logout}>
            Logout <FontAwesomeIcon icon={faSignOutAlt} style={{ marginLeft: "5px" }} />
          </li>
        </ul>
      </li>
    </ul>
  )
}
const Header = () => {
  return (
    <section className={headerStyles.container}>
      <Link to='/'><h3 className={headerStyles.topic}>Scan At</h3></Link>
      <Navigation />
    </section>
  )
}

export default Header