import React, { useState } from "react"
import Header from "./header"
import layoutStyles from "./layout.module.css"
// import LoginModal from "./main/loginModal"
// import SnackBar from "./snackBar"

const Layout = ({ children }) => {
  const [login, setLogin] = useState(false)

  const loginModal = () => {
    setLogin(true)
  }

  return (
    <section className={layoutStyles.container}>
      <Header onHandleLoginModal={loginModal} loginStatus={login} />
      <main className={layoutStyles.main}>
        {children}
      </main>
    </section>
  )
}

export default Layout
