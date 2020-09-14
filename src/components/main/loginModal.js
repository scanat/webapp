import React, { useState, useEffect } from "react"
import loginModalStyles from "./loginModal.module.css"
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Auth } from "aws-amplify"
import { navigate } from "gatsby"
import { setUser, isLoggedIn, getCurrentUser } from "../../utils/auth"
import SnackBar from "../snackBar"
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import stateCityList from "../../pre-data/state-city.json"

const LoginSection = props => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const userLogin = async () => {
    if (
      username !== null && password !== null
    ) {
      try {
        const user = await Auth.signIn(username, password)
        setUser(user)
        props.switchContent("Success", true)
        navigate("/")
        props.closeLoginModal()
        console.log(getCurrentUser())
      } catch (error) {
        props.switchContent(error.message, false)
      }
    } else {
      props.switchContent("Credentials are required!", false)
    }
  }

  return (
    <section className={loginModalStyles.inputArea}>
      <h3 style={{ marginBottom: "20px", color: "#169188" }}>LOGIN</h3>
      <input
        id="loginId"
        className={loginModalStyles.input}
        required
        type="text"
        placeholder="Email/Username"
        onChange={event => setUsername(event.target.value)}
      />
      <input
        className={loginModalStyles.input}
        id="password"
        required
        type="password"
        placeholder="password"
        onChange={event => setPassword(event.target.value)}
      />
      <section className={loginModalStyles.buttonContainer}>
        <button
          className={loginModalStyles.loginButton}
          type="submit"
          onClick={userLogin}
          onMouseUp={userLogin}
        >
          Login
        </button>
        <button
          className={loginModalStyles.panelOpenButton}
          type="button"
          onClick={() => props.switchPanel("reg")}
          onMouseUp={() => props.switchPanel("reg")}
        >
          REGISTER
        </button>
      </section>
      <p
        className={loginModalStyles.resetLabel}
        onClick={() => props.switchPanel("reset")}
        onMouseUp={() => props.switchPanel("reset")}
      >
        Forgot Password?
      </p>
    </section>
  )
}

const RegistrationSection = props => {
  const [name, setName] = useState()
  const [username, setUsername] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [password, setPassword] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [registrationPhase, setRegistrationPhase] = useState(1)
  const [gpsLocale, setGpsLocale] = useState("")
  const [regdApplyFor, setRegdApplyFor] = useState("Digital Restaurant")
  const [selectedState, setSelectedState] = useState("Maharashtra")
  const [selectedCity, setSelectedCity] = useState("Mumbai")
  const [regdPostalAddress, setRegdPostalAddress] = useState("")
  const [regdPostalCode, setRegdPostalCode] = useState("")
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [regdOrgName, setRegdOrgName] = useState("")
  const [regdEmail, setRegdEmail] = useState("")

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      gpsevent => setGpsLocale(gpsevent),
      () => props.switchContent("User location failed!", false),
      {enableHighAccuracy:true, maximumAge: 10000}
    )
  }, [])

  const registerUser = async () => {
    if (password && confirmPass) {
      if (password === confirmPass) {
        let websiteOrgName = regdOrgName.replace(new RegExp(" ", "g"), "")
        console.log(password)
        try {
          const user = await Auth.signUp({
            username: username,
            password: password,
            attributes: {
              email: regdEmail,
              phone_number: `+91${phoneNumber}`,
              name: regdOrgName,
              address: gpsLocale
                ? "Lat " +
                  gpsLocale.coords.latitude +
                  " Long " +
                  gpsLocale.coords.longitude
                : "",
              picture: "",
              website: "?org=" + websiteOrgName + "&pn=" + btoa(phoneNumber),
              "custom:nick_name": name,
              "custom:address_line_1": regdPostalAddress,
              "custom:postal_code": regdPostalCode,
              "custom:city": selectedCity,
              "custom:state": selectedState,
              "custom:category": regdApplyFor
            },
          })
          props.switchPanel("login")
          props.switchContent("SUCCESS", true)
          props.switchContent("VERIFY REGISTERED EMAIL", true)
        } catch (error) {
          props.switchContent(error.message, false)
        }
      } else {
        props.switchContent("Password miss-match", false)
      }
    } else {
      props.switchContent("Credentials are required!", false)
    }
  }

  const checkPhase1 = () => {
    if (
      String(name).length > 0 &&
      String(username).length > 0 &&
      String(phoneNumber).length > 0
    ) {
      if (String(phoneNumber).length === 10) setRegistrationPhase(2)
      else {
        props.switchContent("Check input", false)
      }
    } else {
      props.switchContent("Fields can not be empty", false)
    }
  }
  const checkPhase2 = () => {
    if (
      String(regdOrgName).length > 0 &&
      String(regdApplyFor).length > 0 &&
      String(regdPostalAddress).length > 0 &&
      String(regdPostalCode).length > 0 &&
      String(selectedState).length > 0 &&
      String(selectedCity).length > 0
    ) {
      if (isAlphanumeric(regdOrgName)) {
        if (String(regdPostalCode).length === 6) {
          if (regdPostalAddress.length < 256) {
            setRegistrationPhase(3)
          } else {
            props.switchContent("Address too long!", false)
          }
        } else {
          props.switchContent("Enter a valid postal code!", false)
        }
      } else {
        props.switchContent(
          "Only letters and digits are allowed for orgaanization name",
          false
        )
      }
    } else {
      props.switchContent("Fields can not be empty", false)
    }
  }

  const isAlphanumeric = inputtxt => {
    if (inputtxt.match("^[0-9a-zA-Z]")) {
      return true
    } else {
      return false
    }
  }

  const stateCityFormation = event => {
    setSelectedState(event)
    stateCityList.forEach(element => {
      setCities(element[event])
    })
    setSelectedCity(stateCityList[0][selectedState][0].city)
  }

  useEffect(() => {
    stateCityList.forEach(element => {
      setStates(Object.keys(element))
    })
    stateCityFormation("Maharashtra")
  }, [])

  return (
    <section className={loginModalStyles.inputArea}>
      {registrationPhase === 1 && (
        <>
          <h3 className={loginModalStyles.topic}>REGISTER NEW SUBSCRIBER</h3>
          <label className={loginModalStyles.label}>Your Name</label>
          <input
            id="name"
            className={loginModalStyles.input}
            required
            type="text"
            placeholder="Your Name"
            onChange={event => setName(event.target.value)}
          />
          <label className={loginModalStyles.label}>Business Email</label>
          <input
            className={loginModalStyles.input}
            id="email"
            required
            type="text"
            inputMode="email"
            placeholder="Email"
            onChange={event => setRegdEmail(event.target.value)}
          />
          <label className={loginModalStyles.label}>Business Phone Number</label>
          <input
            className={loginModalStyles.input}
            id="phoneNumber"
            required
            type="text"
            inputMode="tel"
            placeholder="Phone Number (10)"
            onChange={event => setPhoneNumber(event.target.value)}
          />

          <section className={loginModalStyles.buttonContainer}>
            <button
              className={loginModalStyles.panelOpenButton}
              type="submit"
              onClick={() => props.switchPanel("login")}
              onMouseUp={() => props.switchPanel("login")}
            >
              Login
            </button>
            <button
              className={loginModalStyles.loginButton}
              type="button"
              onClick={checkPhase1}
              onMouseUp={checkPhase1}
            >
              PROCEED
            </button>
          </section>
        </>
      )}
      {registrationPhase === 2 && (
        <>
          <h3 className={loginModalStyles.topic}>REGISTER ORGANIZATION</h3>
          <section style={{ width: "100%" }}>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              size="lg"
              color="#169188"
              style={{ marginBottom: "10px" }}
              onClick={() => setRegistrationPhase(1)}
              onMouseUp={() => setRegistrationPhase(1)}
            />
          </section>

          <label className={loginModalStyles.label}>Organization Name</label>
          <input
            className={loginModalStyles.input}
            id="regOrgName"
            type="text"
            placeholder="(Alpha Numeric)"
            onChange={event => setRegdOrgName(event.target.value)}
          />
          <label className={loginModalStyles.label}>
            Organization Category
          </label>
          <select
            id="regApplyFor"
            onChange={event => setRegdApplyFor(event.target.value)}
            className={loginModalStyles.selectDropDown}
          >
            <option value="Digital Restaurant">Digital Restaurant</option>
            <option value="Digital Rooms">Digital Rooms</option>
            <option value="Digital Stores">Digital Stores</option>
          </select>
          <label className={loginModalStyles.label}>Postal Address</label>
          <input
            className={loginModalStyles.input}
            id="postalAddress"
            type="text"
            placeholder="House, Street Address, Locality"
            onChange={event => setRegdPostalAddress(event.target.value)}
          />
          <label className={loginModalStyles.label}>Postal/Zip Code</label>
          <input
            className={loginModalStyles.input}
            id="postalCode"
            type="text"
            placeholder="Postal Code / Zip Code"
            onChange={event => setRegdPostalCode(event.target.value)}
          />
          <label className={loginModalStyles.label}>State</label>
          <select
            id="statesList"
            onChange={event => stateCityFormation(event.target.value)}
            className={loginModalStyles.selectDropDown}
          >
            {states.map(element => (
              <option value={element}>{element}</option>
            ))}
          </select>
          <label className={loginModalStyles.label}>City</label>
          <select
            id="cityList"
            onChange={event => setSelectedCity(event.target.value)}
            className={loginModalStyles.selectDropDown}
          >
            {cities.map(element => (
              <option value={element.city}>{element.city}</option>
            ))}
          </select>
          <section className={loginModalStyles.buttonContainer}>
            <button
              className={loginModalStyles.panelOpenButton}
              type="submit"
              onClick={() => props.switchPanel("login")}
              onMouseUp={() => props.switchPanel("login")}
            >
              Login
            </button>
            <button
              className={loginModalStyles.loginButton}
              type="button"
              onClick={checkPhase2}
              onMouseUp={checkPhase2}
            >
              PROCEED
            </button>
          </section>
        </>
      )}
      {registrationPhase === 3 && (
        <>
          <h3 className={loginModalStyles.topic}>SET A PASSCODE</h3>
          <section style={{ width: "100%" }}>
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              size="lg"
              color="#169188"
              style={{ marginBottom: "10px" }}
              onClick={() => setRegistrationPhase(2)}
              onMouseUp={() => setRegistrationPhase(2)}
            />
          </section>
          <label className={loginModalStyles.label}>Login username</label>
          <input
            className={loginModalStyles.input}
            id="username"
            required
            placeholder="Unique Username"
            onChange={event => setUsername(event.target.value)}
          />
          <label className={loginModalStyles.label}>Password</label>
          <input
            className={loginModalStyles.input}
            id="password"
            required
            type="password"
            placeholder="password"
            onChange={event => setPassword(event.target.value)}
          />
          <label className={loginModalStyles.label}>Re-enter Password</label>
          <input
            className={loginModalStyles.input}
            id="password"
            required
            type="password"
            placeholder="confirm password"
            onChange={event => setConfirmPass(event.target.value)}
          />
          <label className={loginModalStyles.label}>
            *Uppercase
            <br />
            *Lowercase
            <br />
            *Min 8 Characters
          </label>
          <section className={loginModalStyles.buttonContainer}>
            <button
              className={loginModalStyles.panelOpenButton}
              type="submit"
              onClick={() => props.switchPanel("login")}
              onMouseUp={() => props.switchPanel("login")}
            >
              Login
            </button>
            <button
              className={loginModalStyles.loginButton}
              type="button"
              onClick={registerUser}
              onMouseUp={registerUser}
            >
              REGISTER
            </button>
          </section>
        </>
      )}
    </section>
  )
}

const ResetSection = props => {
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [code, setCode] = useState()
  const [newPass, setNewPass] = useState()
  const [verify, setVerify] = useState(false)

  const sendVerificationCode = async () => {
    try {
      await Auth.forgotPassword(email)
      setVerify(true)
      props.switchContent(`Verification mail has been sent to ${email}`, true)
    } catch (error) {
      props.switchContent(error.message, false)
    }
  }

  const resetPassword = async () => {
    try {
      await Auth.forgotPasswordSubmit(username, code, newPass)
      props.switchPanel("login")
      props.switchContent("Password has been reset", true)
    } catch (error) {
      props.switchContent(error.message, false)
    }
  }

  return (
    <section className={loginModalStyles.inputArea}>
      <h3 style={{ marginBottom: "20px", color: "#169188" }}>RESET</h3>
      <label style={{ fontSize: 12 }}>Registered Email</label>
      {!verify && (
        <>
          <input
            className={loginModalStyles.input}
            id="userMail"
            required
            type="text"
            inputMode="email"
            placeholder="Email"
            onChange={event => setEmail(event.target.value)}
          />
          <button
            className={loginModalStyles.panelOpenButton}
            type="button"
            onClick={sendVerificationCode}
            onMouseUp={sendVerificationCode}
          >
            Set new password
          </button>
        </>
      )}

      {verify && (
        <>
          <input
            className={loginModalStyles.input}
            id="userName"
            required
            type="text"
            placeholder="Email/Phone Number"
            onChange={event => setUsername(event.target.value)}
          />
          <input
            className={loginModalStyles.input}
            id="verificationCode"
            required
            type="text"
            inputMode="tel"
            placeholder="Verification Code"
            onChange={event => setCode(event.target.value)}
          />
          <input
            className={loginModalStyles.input}
            id="password"
            required
            type="password"
            placeholder="New password"
            onChange={event => setNewPass(event.target.value)}
          />
          <button
            className={loginModalStyles.loginButton}
            type="submit"
            onClick={resetPassword}
            onMouseUp={resetPassword}
          >
            RESET
          </button>
        </>
      )}
      <p
        className={loginModalStyles.resetLabel}
        onClick={() => props.switchPanel("login")}
        onMouseUp={() => props.switchPanel("login")}
      >
        Retry Login!
      </p>
    </section>
  )
}

const LoginModal = props => {
  const [panel, setPanel] = useState("login")
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

  useEffect(() => {
    isLoggedIn() && props.onHandleLoginModal()
  }, [])

  const switchPanel = panel => {
    setPanel(panel)
  }
  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  return (
    <section className={loginModalStyles.container}>
      <section className={loginModalStyles.loginContainer}>
        {panel === "login" && (
          <LoginSection
            switchPanel={panel => switchPanel(panel)}
            switchContent={(content, err) => switchContent(content, err)}
            closeLoginModal={() => props.onHandleLoginModal()}
          />
        )}

        {panel === "reg" && (
          <RegistrationSection
            switchPanel={panel => switchPanel(panel)}
            switchContent={(content, err) => switchContent(content, err)}
          />
        )}

        {panel === "reset" && (
          <ResetSection
            switchPanel={panel => switchPanel(panel)}
            switchContent={(content, err) => switchContent(content, err)}
          />
        )}

        {snackContent && <SnackBar message={snackContent} err={snackError} />}

        <section
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: -1,
          }}
          onClick={props.onHandleLoginModal}
          onMouseUp={props.onHandleLoginModal}
        ></section>
      </section>
    </section>
  )
}

export default LoginModal
