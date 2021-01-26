import Amplify from "aws-amplify"
import config from "../config.json"
import Footer from "./footer"
import Header from "../components/header"
import layoutStyles from "./layout.module.css"
import LoginModal from "./main/loginModal"
import React, { useState } from "react"
import awsmobile from "../aws-exports"

Amplify.configure(awsmobile)

const Layout = ({ children }) => {
  const [login, setLogin] = useState(false)

  const loginModal = () => {
    setLogin(true)
  }

  const closeLoginModal = () => {
    setLogin(false)
  }

  return (
    <section className={layoutStyles.container}>
      <Header onHandleLoginModal={loginModal} loginStatus={login} />
      {login && <LoginModal onHandleLoginModal={closeLoginModal} />}
      <main className={layoutStyles.main}>{children}</main>
      {/* <Footer className={layoutStyles.footer} /> */}
    </section>
  )
}

export default Layout
