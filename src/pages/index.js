import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "../components/header"
import Menu from "../components/menu"

const banner = require("../images/scanat-banner.jpg")

const IndexPage = () => {
  const [menuState, setMenuState] = useState(false)

  const menuStateHandler = () => {
    menuState ? setMenuState(false) : setMenuState(true)
  }

  return (
    <Container>
      <Constant>
        <Header onMenuStateChange={menuStateHandler} />
        <Menu onMenuStateChange={menuState} />
      </Constant>

      <Img src={banner} alt="Scan At Banner" />
    </Container>
  )
}

const Container = styled.section`
    position: relative;
    width: 100%;
    float: left;
    text-align: center;
  `,
  Constant = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  `,
  Img = styled.img`
    width: 90%;
    align-self: center;
    margin-top: 40px;
    margin-left: 5%;
  `

export default IndexPage
