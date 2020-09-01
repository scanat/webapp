import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { navigate } from "gatsby"
import headerStyles from "./header.module.css"

const Header = props => {
  const logOut = () => {
    navigate("/admin/login")
    typeof window !== "undefined" && localStorage.removeItem("loggedIn")
  }

  return (
    <header className={headerStyles.head}>
      <h3 style={{ color: "white" }}>Scan At</h3>

      <section>
        <FontAwesomeIcon
          icon={faBars}
          color="white"
          onClick={() => props.onMenuStateChange()}
        />
        {typeof window !== "undefined" && localStorage.getItem("loggedIn") && (
          <FontAwesomeIcon
            icon={faSignOutAlt}
            color="white"
            onClick={logOut}
            style={{ margin: "0 0 0 30px" }}
          />
        )}
      </section>
    </header>
  )
}

export default Header
