import React, { useState, useEffect } from "react"
import Header from "../../components/header"
import Menu from "../../components/menu"
import Anime from "animejs"
import axios from "axios"
import { navigate } from "gatsby"
import { window, document, exists } from "browser-monads"

import styled from "styled-components"

const Login = () => {
  const [userId, setUserId] = useState("")
  const [pass, setPass] = useState("")
  const [menuState, setMenuState] = useState(false)
  const [regState, setRegState] = useState(false)
  const [regdPhoneNumber, setRegdPhoneNumber] = useState("")
  const [regdEmail, setRegdEmail] = useState("")
  const [regdOrgName, setRegdOrgName] = useState("")
  const [regdPassword, setRegdPassword] = useState("")
  const [regdConfirmPassword, setRegdConfirmPassword] = useState("")
  const [regdApplyFor, setRegdApplyFor] = useState("Digital Restaurant")

  const [windowWidth, setWindowWidth] = useState()
  var RegPanel

  const menuStateHandler = () => {
    menuState ? setMenuState(false) : setMenuState(true)
  }

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      navigate("/admin")
    }
    setWindowWidth(window.innerWidth)

    RegPanel = document.getElementById('regPanel')
  })

  useEffect(() => {
    !menuState
      ? (document.getElementById("menu").style.display = "none")
      : (document.getElementById("menu").style.display = "block")
  }, [menuState])

  const clearInput = () => {
    if (typeof window !== 'undefined') {
      document.getElementById("userIdInput").value = ""
      document.getElementById("userPasswordInput").value = ""
      document.getElementById("userIdInput").style.borderColor = "white"
      document.getElementById("userPasswordInput").style.borderColor = "white"

      document.getElementById("regPhoneNumber").value = ""
      document.getElementById("regEmail").value = ""
      document.getElementById("regOrgName").value = ""
      document.getElementById("regPassword").value = ""
      document.getElementById("regConfirmPassword").value = ""
    }
  }

  const openRegistrationPanel = () => {
    Anime({
      targets: RegPanel,
      opacity: [0, 1],
      height: [0, 220],
      easing: "linear",
      margin: [0, "10px 0"],
      duration: 600,
    })
    setRegState(true)
  }

  const sendRegDetails = async () => {
    if (
      regdPhoneNumber !== null &&
      regdPhoneNumber !== "" &&
      regdEmail !== null &&
      regdEmail !== "" &&
      regdOrgName !== null &&
      regdOrgName !== "" &&
      regdApplyFor !== null &&
      regdApplyFor !== "" &&
      regdPassword !== null &&
      regdPassword !== "" &&
      regdConfirmPassword !== null &&
      regdConfirmPassword !== ""
    ) {
      if (regdConfirmPassword === regdPassword) {
        try {
          const params = {
            phoneNumber: regdPhoneNumber,
            organizationName: regdOrgName,
            email: regdEmail,
            organizationCategory: regdApplyFor,
            password: regdPassword,
          }
          const res = await axios.post(
            `https://y1inhll60d.execute-api.ap-south-1.amazonaws.com/beta/users/add`,
            params
          )
          if (res.status === 201) {
            alert(res.data.msg)
            clearInput()
          } else {
            alert(res.data.msg)
          }
        } catch (error) {
          alert("Oops, somthing went wrong!")
        }
      } else {
        alert("Re-confirm password!")
      }
    }
  }

  const processUserAuth = async () => {
    if (userId !== null && userId !== "" && pass !== null && pass !== "") {
      try {
        const params = {
          phoneNumber: userId,
          password: pass,
        }
        const res = await axios.post(
          `https://y1inhll60d.execute-api.ap-south-1.amazonaws.com/beta/users/login`,
          params
        )
        if (res.status === 201) {
          alert(res.data.msg)
          localStorage.setItem("loggedIn", true)
          localStorage.setItem("userData", JSON.stringify(res.data.item))
          navigate("/admin")
        } else {
          alert(res.data.msg)
        }
      } catch (error) {
        alert("Oops, somthing went wrong!")
      }
    } else {
      if (typeof window !== 'undefined') {
        document.getElementById("userIdInput").style.borderColor = "red"
        document.getElementById("userPasswordInput").style.borderColor = "red"
      }
    }
  }

  return (
    <Container>
      <Constant>
        {windowWidth <= 992 && (
          <Header onMenuStateChange={menuStateHandler} />
        )}
        <Menu onMenuStateChange={menuState} />
      </Constant>
      <LoginPanel>
        <Input
          id="userIdInput"
          type="text"
          placeholder="Enter your login id"
          inputMode="tel"
          onChange={event => setUserId(event.target.value)}
        />
        <Input
          id="userPasswordInput"
          type="password"
          placeholder="********"
          onChange={event => setPass(event.target.value)}
        />

        <ButtonContainer>
          <Button type="button" onClick={processUserAuth}>
            Submit
          </Button>
          <Button type="button" onClick={clearInput}>
            Reset
          </Button>
        </ButtonContainer>

        <RegistrationPanel id="regPanel">
          <Input
            id="regPhoneNumber"
            type="text"
            placeholder="Phone Number"
            inputMode="tel"
            onChange={event => setRegdPhoneNumber(event.target.value)}
          />

          <Input
            id="regEmail"
            type="text"
            placeholder="Email ID"
            inputMode="email"
            onChange={event => setRegdEmail(event.target.value)}
          />

          <Input
            id="regOrgName"
            type="text"
            placeholder="Organization Name"
            onChange={event => setRegdOrgName(event.target.value)}
          />

          <select
            id="regApplyFor"
            onChange={event => setRegdApplyFor(event.target.value)}
          >
            <option value="Digital Restaurant">Digital Restaurant</option>
            <option value="Digital Rooms">Digital Rooms</option>
          </select>

          <Input
            id="regPassword"
            type="password"
            placeholder="Password"
            onChange={event => setRegdPassword(event.target.value)}
          />

          <Input
            id="regConfirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={event => setRegdConfirmPassword(event.target.value)}
          />
        </RegistrationPanel>

        <ButtonReg
          type="button"
          onClick={regState ? sendRegDetails : openRegistrationPanel}
        >
          REGISTER NEW USER
        </ButtonReg>
      </LoginPanel>
    </Container>
  )
}

const Container = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    flex: 1;
    background: transparent;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.1);
  `,
  Constant = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  `,
  LoginPanel = styled.section`
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.54);
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    min-width: 250px;
    max-width: 100%;
    z-index: 1;
  `,
  Input = styled.input`
    margin: 10px 0;
    border-bottom: white 1px solid;
    border-top: none;
    border-left: none;
    border-right: none;
    background: none;
    color: white;
    font-size: 15px;
  `,
  ButtonContainer = styled.section`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px 0;
  `,
  Button = styled.button`
    width: 80px;
    background: white;
    padding: 5px 10px;
    border: gray 1px solid;
    border-radius: 10px;
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2),
      inset -5px -5px 10px white;
    -moz-box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2),
      inset -5px -5px 10px white;
    -webkit-box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2),
      inset -5px -5px 10px white;
  `,
  ButtonReg = styled.button`
    background: #169188;
    padding: 5px 10px;
    border: gray 1px solid;
    border-radius: 7px;
    box-shadow: inset 5px 5px 10px rgba(255, 255, 255, 0.2),
      inset -5px -5px 10px #169188;
    -moz-box-shadow: inset 5px 5px 10px rgba(255, 255, 255, 0.2),
      inset -5px -5px 10px #169188;
    -webkit-box-shadow: inset 5px 5px 10px rgba(255, 255, 255, 0.2),
      inset -5px -5px 10px #169188;
    color: white;
  `,
  RegistrationPanel = styled.section`
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    height: 0;
    overflow: hidden;
  `

export default Login
