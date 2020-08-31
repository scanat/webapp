import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import {navigate} from 'gatsby'

const Header = props => {
  const logOut = () => {
    navigate('/admin/login')
    localStorage.removeItem("loggedIn")
  }

  return (
    <Head>
      <h3 style={{ color: "white" }}>Scan At</h3>

      <section>
        <FontAwesomeIcon
          icon={faBars}
          color="white"
          onClick={() => props.onMenuStateChange()}
        />
        {localStorage.getItem("loggedIn") && (
          <FontAwesomeIcon
            icon={faSignOutAlt}
            color="white"
            onClick={logOut}
            style={{ margin: "0 0 0 30px" }}
          />
        )}
      </section>
    </Head>
  )
}

const Head = styled.header`
  background: #169188;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
`

export default Header
