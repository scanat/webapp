import React from "react"
import Header from "../components/header"
import layoutStyles from "./layout.module.css"
import Footer from "./footer"
import Amplify from 'aws-amplify'
import awsmobile from '../aws-exports'

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