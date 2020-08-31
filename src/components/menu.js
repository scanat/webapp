import React, { useEffect } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import Anime from "animejs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFacebook,
  faInstagram,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons"

const Menu = props => {

  useEffect(() => {
    Anime({
      autoplay: true,
      targets: document.getElementById("menu"),
      translateX: [-320, 0],
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
    <Contain id="menu">
      <Nav>
        <h3
          id="headerText"
          style={{ fontSize: 16, color: "white", margin: "20px" }}
        >
          Live safe. Serve effortless.
        </h3>
        <ul>
          <Line>
            <Link to="/" style={{ margin: `0 20px`, color: `white` }}>
              - Home
            </Link>
          </Line>
          <Line>
            <Link to="/admin" style={{ margin: `0 20px`, color: `white` }}>
              - Manager Login
            </Link>
          </Line>
        </ul>
      </Nav>
      <Foot>
        <Link to="/">
          <FontAwesomeIcon icon={faFacebook} color="white" size={"2x"} />
        </Link>
        <Link to="/">
          <FontAwesomeIcon icon={faInstagram} color="white" size={"2x"} />
        </Link>
        <Link to="/">
          <FontAwesomeIcon icon={faPinterest} color="white" size={"2x"} />
        </Link>
      </Foot>
    </Contain>
  )
}

const Contain = styled.section`
    position: relative;
    width: 300px;
    background: rgba(0, 0, 0, 0.54);
    height: ${window.innerWidth <= 992 ? "calc(100vh - 50px)" : "100vh"};
    transform: ${window.innerWidth <= 992 && "translateX(-302)"};
  `,
  Nav = styled.nav`
    float: left;
    width: 100%;
    color: #f07f16;
  `,
  Line = styled.li`
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    &:hover {
      background: #343c44;
    }
  `,
  Foot = styled.section`
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    justify-content: space-around;
    padding: 20px 0;
  `

export default Menu
