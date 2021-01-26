import React, { useEffect, useState, useRef } from "react"
import loginStyles from "./login.module.css"
import Layout from "../components/layout"
import { getCurrentUser, isLoggedIn, setUser } from "../utils/auth"
import { navigate } from "gatsby"
import { createSubscriber } from "../graphql/mutations"
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify"
import Anime from "animejs"
import OtpInput from "react-otp-input"
import AwesomeSlider from "react-awesome-slider"
import "react-awesome-slider/dist/styles.css"
import { faDharmachakra } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import awsmobile from "../aws-exports"

Amplify.configure(awsmobile)

const LoginPage = () => {
  const [panel, setPanel] = useState(1)
  const [category, setCategory] = useState("")

  useEffect(() => {
    isLoggedIn() && navigate("/")
  }, [])

  const switchPanel = panelId => {
    setPanel(panelId)
  }

  return (
    <Layout>
      <AwesomeSlider
        style={{ width: "100%", height: "100vh" }}
        bullets={false}
        selected={panel}
        organicArrows={false}
        mobileTouch={false}
      >
        <div>
          <ResetSection switchPanel={panelId => switchPanel(panelId)} />
        </div>
        <div>
          <LoginSection switchPanel={panelId => switchPanel(panelId)} />
        </div>
        <div>
          <RegistrationSection switchPanel={panelId => switchPanel(panelId)} />
        </div>
        <div>
          <OtpSection switchPanel={panelId => switchPanel(panelId)} />
        </div>
        <div>
          <CategorySelection
            switchPanel={panelId => switchPanel(panelId)}
            category={categoryName => setCategory(categoryName)}
          />
        </div>
        <div>
          <PageIdSelect
            switchPanel={panelId => switchPanel(panelId)}
            category={category}
          />
        </div>
      </AwesomeSlider>
    </Layout>
  )
}

export default LoginPage

const LoginSection = props => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [resultContent, setResultContent] = useState({ msg: "", status: true })
  const loginRef = useRef(null)
  const noticeRef = useRef("")

  async function userLogin(){
    if (username !== "" && password !== "") {
      try {
        const user = await Auth.signIn(username, password)
        setUser(user)
        navigate("/profile")
      } catch (error) {
        noticeRef.current.innerHTML = error.message
      }
    } else {
      setResultContent({ msg: "Credentials are required!", status: false })
    }
  }

  return (
    <section ref={loginRef} className={loginStyles.inputArea}>
      <h3
        style={{
          margin: "20px",
          color: "white",
          fontSize: "14px",
          letterSpacing: 2,
        }}
      >
        LOGIN
      </h3>
      <input
        id="loginId"
        className={loginStyles.input}
        required
        type="text"
        placeholder="Phone Number / Email"
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
        {resultContent.message}
      </label>
      <p ref={noticeRef} style={{ fontSize: "0.8em", color: "crimson" }}></p>
      <p
        className={loginStyles.resetLabel}
        onClick={() => props.switchPanel(2)}
      >
        <u>Register New User?</u>
      </p>
      <p
        className={loginStyles.resetLabel}
        onClick={() => props.switchPanel(0)}
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
                name: name,
                phone_number: `+91${phoneNumber}`,
              },
            })
            user && props.switchPanel(3)
            localStorage.setItem("username", username)
            localStorage.setItem("password", password)
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
        style={{
          marginBottom: "20px",
          color: "whitesmoke",
          fontSize: "14px",
          letterSpacing: 2,
        }}
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
        onClick={() => props.switchPanel(1)}
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
      props.switchPanel(1)
      setResultContent({ msg: "Password has been reset", status: true })
    } catch (error) {
      setResultContent({ msg: error.message, status: false })
    }
  }

  return (
    <section className={loginStyles.inputArea}>
      <h3
        style={{
          marginBottom: "20px",
          color: "whitesmoke",
          fontSize: "14px",
          letterSpacing: 2,
        }}
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
          props.switchPanel(1)
        }}
      >
        Retry Login!
      </p>
    </section>
  )
}

const OtpSection = props => {
  const [otp, setOtp] = useState("")

  useEffect(() => {
    if (otp.length === 6) {
      confirmOtp()
    }
  }, [otp])

  async function signIn() {
    try {
      let username = localStorage.getItem("username")
      let password = localStorage.getItem("password")
      await Auth.signIn(username, password).then(result => {
        console.log(result)
        if (result) {
          setUser(result)
          props.switchPanel(4)
        }
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  async function confirmOtp() {
    try {
      console.log(otp)
      await Auth.confirmSignUp(localStorage.getItem("username"), otp).then(
        res => res && signIn()
      )
    } catch (error) {
      console.log(error)
    }
  }

  async function resendOtp() {
    try {
      await Auth.resendSignUp(localStorage.getItem("username")).then(res => {
        setOtp("")
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={loginStyles.inputArea}>
      <h3
        style={{
          marginBottom: "20px",
          color: "whitesmoke",
          fontSize: "14px",
          letterSpacing: 2,
          textAlign: "center",
        }}
      >
        VERIFY OTP <br />
        <label
          style={{ margin: "10px 0", fontWeight: "lighter", fontSize: "0.8em" }}
        >
          {localStorage.getItem("username")}
        </label>
      </h3>
      <OtpInput
        value={otp}
        onChange={e => setOtp(e)}
        numInputs={6}
        inputStyle={{ width: 20, height: 30, margin: "0 5px" }}
        containerStyle={{
          background: "rgba(244, 244, 244, 0.8)",
          padding: 10,
          borderRadius: 5,
        }}
        shouldAutoFocus
      />
      <label
        onClick={resendOtp}
        style={{
          fontSize: "0.8em",
          letterSpacing: "1px",
          fontWeight: "bold",
          color: "whitesmoke",
          marginTop: "10px",
        }}
      >
        RESEND OTP
      </label>
    </section>
  )
}

const CategorySelection = props => {
  const [categoryList, setCategoryList] = useState([
    { name: "Digital Restaurant", image: "1.png" },
    { name: "Digital Hotel", image: "2.png" },
    { name: "Digital Store", image: "3.png" },
    { name: "Digital Fashion", image: "4.png" },
  ])

  const categorySelect = item => {
    props.category(item)
    props.switchPanel(5)
  }

  return (
    <section className={loginStyles.container}>
      <section className={loginStyles.catgoriesContainer}>
        {categoryList.map((item, id) => (
          <section
            key={id}
            className={loginStyles.categoriesHolder}
            onClick={() => categorySelect(item)}
          >
            <img src={require(`../images/categories/${item.image}`)} />
            <label>{item.name}</label>
          </section>
        ))}
      </section>
    </section>
  )
}

const PageIdSelect = props => {
  const [pageId, setPageId] = useState("")
  const [orgName, setOrgName] = useState("")
  const [avail, setAvail] = useState()
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    Anime({
      targets: document.getElementById("spinnerId"),
      loop: true,
      autoplay: true,
      rotate: [0, 360],
      easing: "linear",
      duration: 1800,
    })
  }, [])

  const pageIdHandler = async e => {
    let inputElement = inputRef.current
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    let text = e.target.value
    if (!format.test(text)) {
      setPageId(text)
      inputElement.style.borderColor = "grey"
      setLoading(true)
      try {
        const avail = await API.graphql(
          graphqlOperation(checkSubscriber, { id: text })
        )
        avail.data.getSubscriber ? setAvail(false) : setAvail(true)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    } else {
      inputElement.style.borderColor = "red"
      setAvail()
    }
  }

  const finalizePageId = async () => {
    const inputs = {
      id: pageId,
      group: "Owners",
      email: getCurrentUser().email,
      phoneNumber: getCurrentUser().phone_number,
      name: getCurrentUser().name,
      category: props.category.name,
      orgName: String(orgName).toLowerCase(),
    }
    const pageInputs = {
      id: pageId,
    }
    try {
      const user = await Auth.updateUserAttributes(
        await Auth.currentAuthenticatedUser(),
        {
          "custom:page_id": pageId,
        }
      )
      await API.graphql(graphqlOperation(createSubscriber, { input: inputs }))

      if (orgName.length > 0) {
        navigate("/profile")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={loginStyles.inputArea}>
      <section className={loginStyles.socialLinkInputHolder}>
        <label
          style={{ fontSize: "1rem", margin: "0 5px", color: "whitesmoke" }}
        >
          Organization Name{" "}
        </label>
        <input
          ref={inputRef}
          className={loginStyles.socialTextInput}
          placeholder="Organization Name"
          autoFocus
          onChange={e => setOrgName(e.target.value)}
        />
      </section>
      <label style={{ fontSize: "0.9em", color: "whitesmoke" }}>
        Page ID is subject to availability
        <br />
        **No special character allowed
      </label>
      <section className={loginStyles.socialLinkInputHolder}>
        <label
          style={{ fontSize: "1rem", margin: "0 5px", color: "whitesmoke" }}
        >
          Create a ScanAt Page{" "}
        </label>
        <input
          ref={inputRef}
          className={loginStyles.socialTextInput}
          placeholder="New Page ID"
          autoFocus
          onChange={pageIdHandler}
        />
      </section>
      <label style={{ fontSize: "0.8em", color: "whitesmoke" }}>
        scanat.in/{pageId}
      </label>
      {loading && (
        <FontAwesomeIcon
          id="spinnerId"
          icon={faDharmachakra}
          size="1x"
          color="whitesmoke"
        />
      )}
      {pageId.length > 0 && (
        <label
          style={{ fontSize: "0.8em", color: avail ? "green" : "crimson" }}
        >
          {avail ? "Available" : "Unavailable"}
        </label>
      )}

      {pageId.length > 0 && (
        <button
          onClick={finalizePageId}
          type="submit"
          className={loginStyles.submitButton}
        >
          Create Page
        </button>
      )}
    </section>
  )
}

export const checkSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      id
    }
  }
`
