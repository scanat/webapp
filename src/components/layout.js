import React, {useState} from "react"
import Header from "../components/header"
import Menu from "../components/menu"
import layoutStyles from "./layout.model.css"

const Layout = ({ children }) => {
  const [menuState, setMenuState] = useState(false)

  const menuStateHandler = () => {
    menuState ? setMenuState(false) : setMenuState(true)
  }

  return (
    <section className={layoutStyles.container}>
      <Header onMenuStateChange={menuStateHandler} />
      <Menu onMenuStateChange={menuState} />
      <main className={layoutStyles.main}>{children}</main>
    </section>
  )
}

export default Layout
