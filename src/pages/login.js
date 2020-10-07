import React, { useEffect, useState, useRef } from "react"
import loginStyles from "./login.module.css"
import Layout from "../components/layout"
import { isLoggedIn, setUser } from "../utils/auth"
import { navigate, useStaticQuery } from "gatsby"
import { Auth } from "aws-amplify"
import Anime from "animejs"

const LoginPage = () => {
  const [panel, setPanel] = useState("login")
  const layoutRef = useRef(null)
  const resetRef = useRef(null)

  useEffect(() => {
    isLoggedIn() && navigate("/")
  }, [])

  const switchPanel = panelId => {
    let prevPanel = panel
    setPanel(panelId)
    const animeLogin = Anime({
      targets: layoutRef.current,
      duration: 2000,
      easing: "easeInOutCubic",
      marginLeft: [0, "-100%"],
      autoplay: false,
    })
    const animeReset = Anime({
      targets: resetRef.current,
      duration: 2000,
      easing: "easeInOutCubic",
      top: ["100vh", 0],
      autoplay: false,
    })
    if (prevPanel === "login" && panelId === "reg") {
      animeLogin.play()
    } else if (prevPanel === "reg" && panelId === "login") {
      animeLogin.reverse()
    } else if (prevPanel === "login" && panelId === "reset") {
      animeReset.play()
    } else if (prevPanel === "reset" && panelId === "login") {
      animeReset.reverse()
    }
  }

  return (
    <Layout>
      <section className={loginStyles.loginContainer}>
        <section ref={layoutRef} className={loginStyles.loginLayout}>
          <LoginSection switchPanel={panelId => switchPanel(panelId)} />
          <RegistrationSection switchPanel={panelId => switchPanel(panelId)} />
        </section>
        <section ref={resetRef} className={loginStyles.resetLayout}>
          <ResetSection switchPanel={panelId => switchPanel(panelId)} />
        </section>
      </section>
    </Layout>
  )
}

export default LoginPage

const LoginSection = props => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [resultContent, setResultContent] = useState({ msg: "", status: true })
  const loginRef = useRef(null)

  const userLogin = async () => {
    if (username !== null && password !== null) {
      try {
        const user = await Auth.signIn(username, password)
        setUser(user)
        setResultContent({ msg: "Success", status: true })
        navigate("/")
      } catch (error) {
        setResultContent({ msg: error.message, status: false })
      }
    } else {
      setResultContent({ msg: "Credentials are required!", status: false })
    }
  }

  return (
    <section ref={loginRef} className={loginStyles.inputArea}>
      <h3 style={{ margin: "20px", color: "white", fontSize: "14px" }}>
        LOGIN
      </h3>
      <input
        id="loginId"
        className={loginStyles.input}
        required
        type="text"
        placeholder="Username / Email"
        onChange={event => setUsername(event.target.value)}
      />
      <input
        className={loginStyles.input}
        id="password"
        required
        type="password"
        placeholder="password"
        onChange={event => setPassword(event.target.value)}
      />
      <section className={loginStyles.buttonContainer}>
        <button
          className={loginStyles.panelOpenButton}
          type="button"
          onClick={() => navigate("/")}
        >
          Later
        </button>
        <button
          className={loginStyles.loginButton}
          type="submit"
          onClick={userLogin}
        >
          Login
        </button>
      </section>
      <label
        style={{
          color: resultContent.status ? "green" : "crimson",
          fontSize: "13px",
        }}
      >
        {resultContent.msg}
      </label>
      <p
        className={loginStyles.resetLabel}
        onClick={() => props.switchPanel("reg")}
      >
        <u>Register New User?</u>
      </p>
      <p
        className={loginStyles.resetLabel}
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
  const [resultContent, setResultContent] = useState({ msg: "", status: true })

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
            setResultContent({ msg: "User Created", status: true })
          } catch (error) {
            setResultContent(error.message)
            console.log(error)
          }
        } else {
          setResultContent({ msg: "Password miss-match", status: false })
        }
      } else {
        setResultContent({
          msg: "Please check your phone number",
          status: "false",
        })
      }
    } else {
      setResultContent({ msg: "Credentials are required!", status: false })
    }
  }

  return (
    <section className={loginStyles.inputArea}>
      <h3
        style={{ marginBottom: "20px", color: "whitesmoke", fontSize: "14px" }}
      >
        REGISTER NEW USER
      </h3>
      <input
        id="name"
        className={loginStyles.input}
        required
        type="text"
        placeholder="Your Name"
        onChange={event => setName(event.target.value)}
      />
      <input
        className={loginStyles.input}
        id="email"
        required
        type="text"
        inputMode="email"
        placeholder="Email"
        onChange={event => setUsername(event.target.value)}
      />
      <input
        className={loginStyles.input}
        id="phoneNumber"
        required
        type="text"
        inputMode="tel"
        placeholder="Phone Number (10)"
        onChange={event => setPhoneNumber(event.target.value)}
      />
      <label className={loginStyles.label}>
        Alphanumeric (min 8 characters long)
      </label>
      <input
        className={loginStyles.input}
        id="password"
        required
        type="password"
        placeholder="password"
        onChange={event => setPassword(event.target.value)}
      />
      <input
        className={loginStyles.input}
        id="password"
        required
        type="password"
        placeholder="confirm password"
        onChange={event => setConfirmPass(event.target.value)}
      />
      <section className={loginStyles.buttonContainer}>
        <button
          className={loginStyles.panelOpenButton}
          type="submit"
          onClick={() => navigate("/")}
        >
          Later
        </button>
        <button
          className={loginStyles.loginButton}
          type="button"
          onClick={registerUser}
        >
          REGISTER
        </button>
      </section>
      <label
        style={{
          color: resultContent.status ? "green" : "crimson",
          fontSize: "13px",
        }}
      >
        {resultContent.msg}
      </label>
      <p
        className={loginStyles.resetLabel}
        onClick={() => props.switchPanel("login")}
      >
        Retry Login?
      </p>
    </section>
  )
}

const ResetSection = props => {
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [code, setCode] = useState()
  const [newPass, setNewPass] = useState()
  const [verify, setVerify] = useState(false)
  const [resultContent, setResultContent] = useState({ msg: "", status: true })

  const sendVerificationCode = async () => {
    try {
      const result = await Auth.forgotPassword(email)
      console.log(result)
      setVerify(true)
      setResultContent({
        msg: `Verification mail has been sent to ${result.CodeDeliveryDetails.Destination}`,
        status: true,
      })
    } catch (error) {
      setResultContent({ msg: error.message, status: false })
    }
  }

  const resetPassword = async () => {
    try {
      await Auth.forgotPasswordSubmit(username, code, newPass)
      props.switchPanel("login")
      setResultContent({ msg: "Password has been reset", status: true })
    } catch (error) {
      setResultContent({ msg: error.message, status: false })
    }
  }

  return (
    <section className={loginStyles.inputArea}>
      <h3
        style={{ marginBottom: "20px", color: "whitesmoke", fontSize: "14px" }}
      >
        RESET
      </h3>
      <label style={{ fontSize: 12, color: "whitesmoke" }}>
        Registered Email / Username
      </label>
      {!verify && (
        <>
          <input
            className={loginStyles.input}
            id="userMail"
            required
            type="text"
            inputMode="email"
            placeholder="Email"
            onChange={event => setEmail(event.target.value)}
          />
          <button
            className={loginStyles.panelOpenButton}
            type="button"
            onClick={sendVerificationCode}
          >
            Send Code
          </button>
        </>
      )}

      {verify && (
        <>
          <input
            className={loginStyles.input}
            id="userName"
            required
            type="text"
            placeholder="Email/Phone Number"
            onChange={event => setUsername(event.target.value)}
          />
          <input
            className={loginStyles.input}
            id="verificationCode"
            required
            type="text"
            inputMode="tel"
            placeholder="Verification Code"
            onChange={event => setCode(event.target.value)}
          />
          <input
            className={loginStyles.input}
            id="password"
            required
            type="password"
            placeholder="New password"
            onChange={event => setNewPass(event.target.value)}
          />
          <button
            className={loginStyles.loginButton}
            type="submit"
            onClick={resetPassword}
          >
            RESET
          </button>
        </>
      )}
      <label
        style={{
          color: resultContent.status ? "green" : "crimson",
          fontSize: "13px",
        }}
      >
        {resultContent.msg}
      </label>
      <p
        className={loginStyles.resetLabel}
        onClick={() => {
          setVerify(false)
          props.switchPanel("login")
        }}
      >
        Retry Login!
      </p>
    </section>
  )
}
