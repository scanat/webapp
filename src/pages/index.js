import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Header from "../components/header"
import Menu from "../components/menu"
import '../styles/index.scss'
import '../styles/common.scss'

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
    <section className='container'>
      <section className='constant'>
        {windowWidth <= 992 && (
          <Header onMenuStateChange={menuStateHandler} />
        )}
        <Menu onMenuStateChange={menuState} />
      </section>

      <img
        src={banner}
        alt="Scan At Banner"
        className='scanatBanner'
      />
    </section>
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
