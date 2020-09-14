import React, { useState, useEffect } from "react"
import loginModalStyles from "./loginModal.module.css"
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Auth } from "aws-amplify"
import { navigate } from "gatsby"
import { setUser, isLoggedIn, getCurrentUser } from "../../utils/auth"
import SnackBar from "../snackBar"

const LoginSection = props => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const userLogin = async () => {
    if (username !== null && password !== null) {
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
        placeholder="Email"
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
        >
          Login
        </button>
        <button
          className={loginModalStyles.panelOpenButton}
          type="button"
          onClick={() => props.switchPanel("reg")}
        >
          REGISTER
        </button>
      </section>
      <p
        className={loginModalStyles.resetLabel}
        onClick={() => props.switchPanel("reset")}
      >
        Forgot Password?
      </p>
    </section>
  )
}

const RegistrationSection = props => {
  const [name, setName] = useState(null)
  const [username, setUsername] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPass, setConfirmPass] = useState(null)

  const registerUser = async () => {
    if (
      name !== null &&
      username !== null &&
      password !== null &&
      phoneNumber !== null
    ) {
      if (String(phoneNumber).length === 10) {
        if (password === confirmPass) {
          try {
            const user = await Auth.signUp({
              username,
              password,
              attributes: {
                email: username,
                address: "",
                name: name,
                phone_number: `+91${phoneNumber}`,
              },
            })
            props.switchPanel("login")
            props.switchContent("User Created", true)
          } catch (error) {
            props.switchContent(error.message, false)
          }
        } else {
          props.switchContent("Password miss-match", false)
        }
      }
      else{
        props.switchContent("Please check your phone number", false)
      }
    } else {
      props.switchContent("Credentials are required!", false)
    }
  }

  return (
    <section className={loginModalStyles.inputArea}>
      <h3 style={{ marginBottom: "20px", color: "#169188" }}>
        REGISTER NEW USER
      </h3>
      <input
        id="name"
        className={loginModalStyles.input}
        required
        type="text"
        placeholder="Your Name"
        onChange={event => setName(event.target.value)}
      />
      <input
        className={loginModalStyles.input}
        id="email"
        required
        type="text"
        inputMode="email"
        placeholder="Email"
        onChange={event => setUsername(event.target.value)}
      />
      <input
        className={loginModalStyles.input}
        id="phoneNumber"
        required
        type="text"
        inputMode="tel"
        placeholder="Phone Number (10)"
        onChange={event => setPhoneNumber(event.target.value)}
      />
      <label className={loginModalStyles.label}>
        Alphanumeric (min 8 characters long)
      </label>
      <input
        className={loginModalStyles.input}
        id="password"
        required
        type="password"
        placeholder="password"
        onChange={event => setPassword(event.target.value)}
      />
      <input
        className={loginModalStyles.input}
        id="password"
        required
        type="password"
        placeholder="confirm password"
        onChange={event => setConfirmPass(event.target.value)}
      />
      <section className={loginModalStyles.buttonContainer}>
        <button
          className={loginModalStyles.panelOpenButton}
          type="submit"
          onClick={() => props.switchPanel("login")}
        >
          Login
        </button>
        <button
          className={loginModalStyles.loginButton}
          type="button"
          onClick={registerUser}
        >
          REGISTER
        </button>
      </section>
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
          >
            RESET
          </button>
        </>
      )}
      <p
        className={loginModalStyles.resetLabel}
        onClick={() => props.switchPanel("login")}
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
        ></section>
      </section>
    </section>
  )
}

export default LoginModal
