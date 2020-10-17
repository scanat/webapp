import React from "react"
import Header from "../components/header"
import layoutStyles from "./layout.module.css"
import Footer from "./footer"

const Layout = ({ children }) => {

  return (
    <section className={layoutStyles.container}>
      <Header />
      <main className={layoutStyles.main}>
        {children}
      </main>
        <Footer className={layoutStyles.footer} />
    </section>
  )
}

export default Layout