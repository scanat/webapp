import Amplify from "aws-amplify"
import config from "../config.json"
import Footer from "./footer"
import Header from "../components/header"
import layoutStyles from "./layout.module.css"
import LoginModal from "./main/loginModal"
import React, { useState } from "react"

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
    </section>
  )
}

export default Layout
