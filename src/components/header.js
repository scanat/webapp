import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { navigate, Link } from "gatsby"
import headerStyles from "./header.module.css"
import scanatlogo from "../images/scan_at_logo.png"
import { Auth } from "aws-amplify"

const Header = props => {
  const [userData, setUserData] = useState()
  const [subMenu, setSubMenu] = useState(false)

  useEffect(() => {
    func()
  }, [props.loginStatus])

  const func = async () => {
    try {
      const session = await Auth.currentSession()
      const user = await Auth.currentAuthenticatedUser()
      setUserData(user)
    } catch (error) {
      console.log(error)
    }
  }

  const toggleSubmenu = () => {
    subMenu ? setSubMenu(false) : setSubMenu(true)
  }

  const logOut = async () => {
    try {
      const logout = await Auth.signOut()
      navigate("/")
      setUserData()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    func()
  }, [])

  return (
    <header className={headerStyles.head}>
      <img
        className={headerStyles.logo}
        alt="Scan At Logo"
        src={scanatlogo}
        onClick={() => {
          navigate("/")
        }}
      />

      <ul className={headerStyles.headerRightContainer}>
        {userData && (
          <li onClick={toggleSubmenu}>
            Welcome, {userData.username}
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
              <li onClick={logOut}>Logout</li>
            </ul>
          </li>
        )}
        {!userData && (
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
              <label
                style={{
                  color: "white",
                  marginLeft: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                  textTransform: "none",
                }}
              >
                Login
              </label>
            </section>
          </li>
        )}
      </ul>
    </header>
  )
}

export default Header
