import React, { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { navigate } from "gatsby"
import headerStyles from "./header.module.css"
import Button from "@material-ui/core/Button"

import scanatlogo from "../images/scan_at_logo.png"

const Header = props => {
  const logOut = () => {
    navigate("/admin/login")
    typeof window !== "undefined" && localStorage.removeItem("loggedIn")
  }

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

      <section className={headerStyles.headerRightContainer}>
        <Button
          variant="contained"
          color="primary"
          style={{ borderRadius: "20px", background: "rgba(0, 0, 0, 0.34)" }}
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
        </Button>
        {/* <FontAwesomeIcon
          icon={faBars}
          color="white"
          onClick={() => props.onMenuStateChange()}
        /> */}

        <Button
          variant="contained"
          color="primary"
          style={{ borderRadius: "20px", background: "rgba(255, 255, 255, 0.84)", marginLeft: '10px' }}
        >
          <label
            style={{
              color: "black",
              marginLeft: "5px",
              fontSize: "13px",
              cursor: "pointer",
              textTransform: "none",
            }}
          >
            Signup
          </label>
        </Button>

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
