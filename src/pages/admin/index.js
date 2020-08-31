import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "../../components/header"
import Menu from "../../components/menu"
import Home from './components/home'
import {navigate} from 'gatsby'

const Index = () => {
  const [menuState, setMenuState] = useState(false)
  const [windowWidth, setWindowWidth] = useState()

  useEffect(() => {
    setWindowWidth(window.innerWidth)
  })

  const menuStateHandler = () => {
    menuState ? setMenuState(false) : setMenuState(true)
  }

  useEffect(() => {
    !menuState
      ? (document.getElementById("menu").style.display = "none")
      : (document.getElementById("menu").style.display = "block")
  }, [menuState])

  useEffect(() => {
    if (
      !localStorage.getItem("loggedIn") ||
      localStorage.getItem("loggedIn") === null
    ) {
      navigate('/admin/login')
    }
  })

  return (
    <Container>
      <Constant>
        {windowWidth <= 992 && (
          <Header onMenuStateChange={menuStateHandler} />
        )}
        <Menu onMenuStateChange={menuState}/>
      </Constant>
      <Home />
    </Container>
  )
}

const Container = styled.section`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex: 1;
    background: transparent;
    justify-content: center;
  `,
  Constant = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  `

export default Index
