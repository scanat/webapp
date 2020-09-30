import React, { useState } from "react"
import Header from "../components/header"
import layoutStyles from "./layout.module.css"
import LoginModal from "./main/loginModal"
import BottomNavigation from './bottomNavigation'
import Footer from "./footer"
import Amplify from "aws-amplify"
import config from "../config.json"

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
})

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
      <Footer className={layoutStyles.footer} />
      <BottomNavigation />
    </section>
  )
}

export default Layout
