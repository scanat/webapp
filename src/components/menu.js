import React, { useEffect } from "react"
import { Link } from "gatsby"
import Anime from "animejs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFacebook,
  faInstagram,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons"
import menuStyles from "./menu.module.css"

import scanatlogo from '../images/scan_at_logo.png'

const Menu = props => {
  useEffect(() => {
    Anime({
      autoplay: true,
      targets: document.getElementById("menu"),
      left: [-320, 0],
      easing: "easeInOutSine",
      duration: 600,
      direction: props.onMenuStateChange ? "normal" : "reverse",
    })

    Anime({
      targets: document.getElementById("headerText"),
      opacity: [0, 1],
      duration: 1000,
      delay: 600,
      easing: "easeInOutQuad",
      direction: props.onMenuStateChange ? "normal" : "reverse",
    })
  }, [props.onMenuStateChange])

  return (
    <section className={menuStyles.contain} id="menu">
      <nav className={menuStyles.navSection}>
        <h3
          id="headerText"
          style={{
            fontSize: 16,
            color: "white",
            margin: "16px",
            textTransform: "uppercase",
            letterSpacing: '1px',
            textDecoration:'underline'
          }}
        >
          Live safe. Serve effortless.
        </h3>
        <img alt="Scan At Logo" src={scanatlogo} style={{width: '40%', marginLeft: '30%'}} />
        <ul>
          <li className={menuStyles.line}>
            <Link to="/" style={{ margin: `0 20px`, color: `white` }}>
              - Home
            </Link>
          </li>
          <li className={menuStyles.line}>
            <Link to="/admin" style={{ margin: `0 20px`, color: `white` }}>
              - Manager Login
            </Link>
          </li>
        </ul>
      </nav>
      <section className={menuStyles.foot}>
        <Link to="/">
          <FontAwesomeIcon icon={faFacebook} color="white" size={"2x"} />
        </Link>
        <Link to="/">
          <FontAwesomeIcon icon={faInstagram} color="white" size={"2x"} />
        </Link>
        <Link to="/">
          <FontAwesomeIcon icon={faPinterest} color="white" size={"2x"} />
        </Link>
      </section>
    </section>
  )
}

export default Menu
