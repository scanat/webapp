import React, { useState, useEffect } from "react"
import Anime from "animejs"
import axios from "axios"
import Container from "../../components/layout"
import { navigate } from "gatsby"
import loginStyles from "./login.module.css"

const Login = () => {
  const [userId, setUserId] = useState("")
  const [pass, setPass] = useState("")
  const [regState, setRegState] = useState(false)
  const [regdPhoneNumber, setRegdPhoneNumber] = useState("")
  const [regdEmail, setRegdEmail] = useState("")
  const [regdOrgName, setRegdOrgName] = useState("")
  const [regdPassword, setRegdPassword] = useState("")
  const [regdConfirmPassword, setRegdConfirmPassword] = useState("")
  const [regdApplyFor, setRegdApplyFor] = useState("Digital Restaurant")

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      navigate("/admin")
    }
  })

  const clearInput = () => {
    if (typeof window !== "undefined") {
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
      targets: document.getElementById("regPanel"),
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
      if (typeof window !== "undefined") {
        document.getElementById("userIdInput").style.borderColor = "red"
        document.getElementById("userPasswordInput").style.borderColor = "red"
      }
    }
  }

  return (
    <Container>
      <section className={loginStyles.loginPanel}>
        <input
          className={loginStyles.inputSection}
          id="userIdInput"
          type="text"
          placeholder="Login id / Phone Number"
          inputMode="tel"
          onChange={event => setUserId(event.target.value)}
        />
        <input
          className={loginStyles.inputSection}
          id="userPasswordInput"
          type="password"
          placeholder="pass*****word"
          onChange={event => setPass(event.target.value)}
        />

        <section className={loginStyles.buttonContainer}>
          <button className={loginStyles.buttonLogin} type="button" onClick={processUserAuth}>
            Submit
          </button>
          <button className={loginStyles.buttonLogin} type="button" onClick={clearInput}>
            Reset
          </button>
        </section>

        <section className={loginStyles.registrationPanel} id="regPanel">
          <input
            className={loginStyles.inputSection}
            id="regPhoneNumber"
            type="text"
            placeholder="Phone Number"
            inputMode="tel"
            onChange={event => setRegdPhoneNumber(event.target.value)}
          />

          <input
            className={loginStyles.inputSection}
            id="regEmail"
            type="text"
            placeholder="Email ID"
            inputMode="email"
            onChange={event => setRegdEmail(event.target.value)}
          />

          <input
            className={loginStyles.inputSection}
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

          <input
            className={loginStyles.inputSection}
            id="regPassword"
            type="password"
            placeholder="Password"
            onChange={event => setRegdPassword(event.target.value)}
          />

          <input
            className={loginStyles.inputSection}
            id="regConfirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={event => setRegdConfirmPassword(event.target.value)}
          />
        </section>

        <button
          className={loginStyles.buttonReg}
          type="button"
          onClick={regState ? sendRegDetails : openRegistrationPanel}
        >
          REGISTER NEW USER
        </button>
      </section>
    </Container>
  )
}

export default Login
