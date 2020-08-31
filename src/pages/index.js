import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "../components/header"
import Menu from "../components/menu"

const banner = require("../images/scanat-banner.jpg")

const IndexPage = () => {
  const [menuState, setMenuState] = useState(false)
  const [windowWidth, setWindowWidth] = useState()

  useEffect(() => {
    setWindowWidth(window.innerWidth)
  })

  const menuStateHandler = () => {
    menuState ? setMenuState(false) : setMenuState(true)
  }

  return (
    <Container>
      <Constant>
        {windowWidth <= 992 && (
          <Header onMenuStateChange={menuStateHandler} />
        )}
        <Menu onMenuStateChange={menuState} />
      </Constant>

      <img
        src={banner}
        alt="Scan At Banner"
        style={{ height: "90vh", alignSelf: "center", marginTop: "40px" }}
      />
    </Container>
  )
}

const Container = styled.section`
    display: flex;
    flex: 1;
    flex-direction: column;
  `,
  Constant = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  `

export default IndexPage
