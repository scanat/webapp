import React, { useState } from "react"
import Header from "../components/header"
import layoutStyles from "./layout.module.css"
import LoginModal from "./main/loginModal"
import SnackBar from "./snackBar"
import Amplify from 'aws-amplify'
import config from '../config.json'

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
})

const Layout = ({ children }) => {
  const [login, setLogin] = useState(false)
  const [snack, setSnack] = useState(false)

  const loginModal = () => {
    setLogin(true)
  }

  const closeLoginModal = () => {
    setLogin(false)
  }
  const closeSnack = () => {
    setSnack(false)
  }
  const openSnack = () => {
    setSnack(true)
  }

  return (
    <section className={layoutStyles.container}>
      <Header onHandleLoginModal={loginModal} loginStatus={login} />
      {login && (
        <LoginModal
          onHandleLoginModal={closeLoginModal}
          onOpenSnack={openSnack}
        />
      )}
      {snack && <SnackBar onCloseSnack={closeSnack} />}
      <main style={{ marginBottom: 70 }} className={layoutStyles.main}>
        {children}
      </main>
    </section>
  )
}

export default Layout
