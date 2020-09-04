import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { navigate } from "gatsby"
import headerStyles from "./header.module.css"
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
        <section className={headerStyles.loginButton}
          style={{ borderRadius: "20px", background: "rgba(0, 0, 0, 0.34)" }}
          // onClick={() => props.onHandleOpenModal()}
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

        <section
        className={headerStyles.signupButton}
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
        </section>

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
