import React, { useState, useEffect } from "react"
import Anime from "animejs"
import axios from "axios"
import Container from "../../components/layout"
import { navigate } from "gatsby"
import loginStyles from "./login.module.css"
import { setUser } from "../../utils/subsAuth"
import stateCityList from "../../pre-data/state-city.json"

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
  const [selectedState, setSelectedState] = useState("Maharashtra")
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      navigate("/admin/")
    }
    stateCityList.forEach(element => {
      setStates(Object.keys(element))
    })
    stateCityFormation("Maharashtra")
  }, [])

  const stateCityFormation = event => {
    setSelectedState(event)
    stateCityList.forEach(element => {
      setCities(element[event])
    })
  }

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
      height: [0, 380],
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
          alert(error.message)
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
          setUser(res.data.item)
          localStorage.setItem("loggedIn", true)
          localStorage.setItem("subscriberData", JSON.stringify(res.data.item))
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
          placeholder="password"
          onChange={event => setPass(event.target.value)}
        />

        <section className={loginStyles.buttonContainer}>
          <button
            className={loginStyles.buttonLogin}
            type="button"
            onClick={processUserAuth}
          >
            Submit
          </button>
          <button
            className={loginStyles.buttonLogin}
            type="button"
            onClick={clearInput}
          >
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
          <label className={loginStyles.labels}>Email-ID</label>
          <input
            className={loginStyles.inputSection}
            id="regEmail"
            type="text"
            placeholder="Email ID"
            inputMode="email"
            onChange={event => setRegdEmail(event.target.value)}
          />
          <label className={loginStyles.labels}>Organization Name</label>
          <input
            className={loginStyles.inputSection}
            id="regOrgName"
            type="text"
            placeholder="Organization Name"
            onChange={event => setRegdOrgName(event.target.value)}
          />
          <label className={loginStyles.labels}>Organization Category</label>
          <select
            id="regApplyFor"
            onChange={event => setRegdApplyFor(event.target.value)}
          >
            <option value="Digital Restaurant">Digital Restaurant</option>
            <option value="Digital Rooms">Digital Rooms</option>
            <option value="Digital Stores">Digital Stores</option>
          </select>
          <label className={loginStyles.labels}>Enter password</label>
          <input
            className={loginStyles.inputSection}
            id="regPassword"
            type="password"
            placeholder="Password"
            onChange={event => setRegdPassword(event.target.value)}
          />
          <label className={loginStyles.labels}>Re-enter password</label>
          <input
            className={loginStyles.inputSection}
            id="regConfirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={event => setRegdConfirmPassword(event.target.value)}
          />
          <label className={loginStyles.labels}>Postal Address</label>
          <input
            className={loginStyles.inputSection}
            id="addressline1"
            type="text"
            placeholder="House, Street Address, Locality"
            onChange={event => setRegdOrgName(event.target.value)}
          />
          <label className={loginStyles.labels}>State</label>
          <select
            id="statesList"
            onChange={event => stateCityFormation(event.target.value)}
          >
            {states.map(element => (
              <option value={element}>{element}</option>
            ))}
          </select>
          <label className={loginStyles.labels}>City</label>
          <select id="cityList">
            {cities.map(element => (
              <option value={element.city}>{element.city}</option>
            ))}
          </select>
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
