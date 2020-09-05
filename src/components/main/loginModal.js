import React, { useState, useEffect } from "react"
import loginModalStyles from "./loginModal.module.css"
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Auth } from "aws-amplify"
import { navigate } from "gatsby"

const LoginModal = props => {
  const [userDetail, setUserDetail] = useState()
  const [username, setUserName] = useState("")
  const [userMail, setUserMail] = useState("")
  const [password, setUserPass] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [regPanel, setRegPanel] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const [problem, setProblem] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetVerify, setResetVerify] = useState(false)

  const userLogin = async () => {
    if (
      username !== null &&
      username !== "" &&
      password !== null &&
      password !== ""
    ) {
      try {
        const user = await Auth.signIn(username, password)
        if (user) {
          navigate("/")
          setProblem(false)
          setUserDetail(user)
          props.onHandleLoginModal()
        }
      } catch (error) {
        props.onOpenSnack()
        setUserDetail(error.message)
        setProblem(true)
      }
    } else {
      props.onOpenSnack()
    }
  }

  const registerUser = async () => {
    if (
      username !== null &&
      username !== "" &&
      password !== null &&
      password !== "" &&
      userMail !== null &&
      userMail !== "" &&
      userPhone !== null &&
      userPhone !== ""
    ) {
      try {
        const user = await Auth.signUp({
          username,
          password,
          attributes: {
            email: userMail,
          },
        })
        if (user) {
          setProblem(false)
          setRegSuccess(true)
          setRegPanel(false)
          document.getElementById("username").value = ""
          document.getElementById("password").value = ""
        }
      } catch (error) {
        props.onOpenSnack()
        setUserDetail(error.message)
        setProblem(true)
      }
    } else {
      props.onOpenSnack()
    }
  }

  const resetPassword = async () => {
    try {
      await Auth.forgotPassword(userMail)
      setResetVerify(true)
      document.getElementById("userMail").value = ""
    } catch (error) {
      console.log(error)
    }
  }

  const resetVerifyHandler = async () => {
    try {
      await Auth.forgotPasswordSubmit(username, userPhone, password)
      setResetVerify(false)
      setResetMode(false)
    } catch (error) {
      console.log(error)
    }
  }

  const openRegistrationPanel = () => {
    setRegPanel(true)
  }

  return (
    <section className={loginModalStyles.container}>
      <section className={loginModalStyles.loginContainer}>
        {resetMode ? (
          <section className={loginModalStyles.resetInputsContainer}>
            <h3 style={{ marginBottom: "20px", color: "#169188" }}>RESET</h3>
            <input
              className={loginModalStyles.input}
              id="userMail"
              required
              type="text"
              inputMode="email"
              placeholder={resetVerify ? "Username" : "Email"}
              onChange={event =>
                resetVerify
                  ? setUserName(event.target.value)
                  : setUserMail(event.target.value)
              }
            />
            {resetVerify ? (
              <>
                <input
                  className={loginModalStyles.input}
                  id="userMail"
                  required
                  type="text"
                  inputMode="tel"
                  placeholder="Verification Code"
                  onChange={event => setUserPhone(event.target.value)}
                />
                <input
                  className={loginModalStyles.input}
                  id="password"
                  required
                  type="password"
                  placeholder="New password"
                  onChange={event => setUserPass(event.target.value)}
                />
              </>
            ) : (
              <p
                style={{
                  fontSize: 12,
                  width: "80%",
                  textAlign: "center",
                  color: "green",
                }}
              >
                A verification ID will be sent to your registered email
              </p>
            )}

            <button
              className={loginModalStyles.loginButton}
              type="submit"
              onClick={resetVerify ? resetVerifyHandler : resetPassword}
            >
              RESET
            </button>
          </section>
        ) : (
          <section className={loginModalStyles.loginInputsContainer}>
            <h3 style={{ marginBottom: "20px", color: "#169188" }}>LOGIN</h3>
            <input
              id="username"
              className={loginModalStyles.input}
              required
              type="text"
              placeholder={regPanel ? "Create unique username" : "Username"}
              onChange={event => setUserName(event.target.value)}
            />
            {regPanel && (
              <>
                <input
                  className={loginModalStyles.input}
                  id="userMail"
                  required
                  type="text"
                  inputMode="email"
                  placeholder="Email"
                  onChange={event => setUserMail(event.target.value)}
                />
                <input
                  className={loginModalStyles.input}
                  id="userMail"
                  required
                  type="text"
                  inputMode="tel"
                  placeholder="Phone Number"
                  onChange={event => setUserPhone(event.target.value)}
                />
              </>
            )}

            <input
              className={loginModalStyles.input}
              id="password"
              required
              type="password"
              placeholder="pass*****word"
              onChange={event => setUserPass(event.target.value)}
            />
            {regSuccess && (
              <p style={{ fontSize: 12, color: "green", width: "80%" }}>
                A verification mail has been sent over to your email, please
                confirm!
              </p>
            )}
            {problem && (
              <p style={{ fontSize: 12, color: "red", textAlign: "center" }}>
                {userDetail}
              </p>
            )}

            <section className={loginModalStyles.buttonContainer}>
              <button
                className={loginModalStyles.loginButton}
                type="submit"
                onClick={userLogin}
              >
                Login
              </button>
              <button
                className={loginModalStyles.signupButton}
                type="button"
                onClick={regPanel ? registerUser : openRegistrationPanel}
              >
                REGISTER
              </button>
            </section>
          </section>
        )}

        {resetMode ? (
          <p
            className={loginModalStyles.resetLabel}
            onClick={() => setResetMode(false)}
          >
            Retry Login!
          </p>
        ) : (
          <p
            className={loginModalStyles.resetLabel}
            onClick={() => setResetMode(true)}
          >
            Forgot Password?
          </p>
        )}

        {/* Social Login Space */}
        {/* <p>OR</p>
        <section className={loginModalStyles.loginModesContainer}>
          <FontAwesomeIcon icon={faGoogle} color="#169188" />
          <FontAwesomeIcon icon={faFacebookF} color="#169188" />
        </section> */}
      </section>

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
  )
}

export default LoginModal
