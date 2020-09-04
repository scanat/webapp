import React from "react"
import Header from "../components/header"
import layoutStyles from "./layout.module.css"

const Layout = ({ children }) => {

  return (
    <section className={layoutStyles.container}>
      <Header />
      <main style={{marginBottom: 70}} className={layoutStyles.main}>{children}</main>
    </section>
  )
}

export default Layout
