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
  }, [])

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

      <Img
        src={banner}
        alt="Scan At Banner"
      />
    </Container>
  )
}

const Container = styled.section`
    display: flex;
    flex: 1;
    -webkit-flex: 1;
    flex-direction: column;
    -webkit-flex-direction: column;
  `,
  Constant = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  `,
  Img = styled.img`
    height: 90vh;
    align-self: center;
    margin-top: 40px;
  `

export default IndexPage
