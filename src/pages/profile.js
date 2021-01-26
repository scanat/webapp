import Anime from "animejs"
import React, { useEffect, useRef, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey } from "@fortawesome/free-solid-svg-icons"
import { navigate } from "gatsby"
import { Auth } from "aws-amplify"
import { getCurrentUser, logout } from "../utils/auth"
import Feedback from "../components/profile/feedback"
import Faqs from "../components/profile/faqs"
import ManageAddress from "../components/profile/manageAddress"

const Profile = () => {
  const [currentPage, setCurrentPage] = useState(null)
  const [snackMessage, setSnackMessage] = useState()
  const [snackError, setSnackError] = useState()
  const absoluteContainerRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setSnackMessage()
    }, 5000)
  }, [snackMessage, snackError])

  useEffect(() => {
    currentPage
      ? Anime({
          targets: absoluteContainerRef.current,
          left: ["100%", 0],
          duration: 500,
          easing: "linear",
        })
      : Anime({
          targets: absoluteContainerRef.current,
          left: [0, "100%"],
          duration: 500,
          easing: "linear",
        })
  }, [currentPage])

  const snackHandler = (msg, err) => {
    setSnackMessage(msg)
    setSnackError(err)
  }

  const logoutHandler = async () => {
    const res = await Auth.signOut()
    console.log(res)
    logout(logger)
    function logger() {
      navigate("/")
    }
  }

  return (
    <Layout>
      <section className={profileStyles.container}>
        <ProfileHeader />
        <ul className={profileStyles.userControlsContainer}>
          <li onClick={() => setCurrentPage("orders")}>Your Orders</li>
          <li onClick={() => setCurrentPage("notifications")}>Notifications</li>
          <li onClick={() => setCurrentPage("address")}>Manage Address</li>
          <li onClick={() => setCurrentPage("faqs")}>FAQs</li>
          <li onClick={() => setCurrentPage("feedback")}>Send Feedback</li>
          <li onClick={logoutHandler}>Logout</li>
        </ul>
      </section>

      <section
        ref={absoluteContainerRef}
        className={profileStyles.absoluteContainer}
      >
        <button className={profileStyles.backarrow} onClick={() => setCurrentPage(null)}><img src={require("../images/icon/arrowback.png")} /></button>
        <PageHandler page={currentPage && currentPage} />
      </section>
    </Layout>
  )
}

export default Profile

const ProfileHeader = () => {
  return (
    <section className={profileStyles.pheader}>
      <section>
        <h5>{getCurrentUser().name}</h5>
        <label>{getCurrentUser().email}</label>
      </section>
      <h1>{String(getCurrentUser().name).substr(0, 1)}</h1>
    </section>
  )
}

const PageHandler = props => {
  switch (props.page) {
    case "orders":
      return <Feedback />
      break
    case "orders":
      return <Feedback />
      break
    case "address":
      return <ManageAddress />
      break
    case "faqs":
      return <Faqs />
      break
    case "feedback":
      return <Feedback />
      break

    default:
      return <section></section>
      break
  }
}

const UserDetails = props => {
  const [passCode, setPassCode] = useState(false)
  const [oldPass, setOldPass] = useState()
  const [newPass, setNewPass] = useState()
  const [newConfirmPass, setNewConfirmPass] = useState()
  const [name, setName] = useState(getCurrentUser().name)
  const [email, setEmail] = useState(getCurrentUser().email)
  const [phoneNumber, setPhoneNumber] = useState(getCurrentUser().phone_number)
  const [addressLine1, setAddressLine1] = useState(
    getCurrentUser().address_line_1
  )
  const [addressLine2, setAddressLine2] = useState(
    getCurrentUser().address_line_2
  )
  const [postalCode, setPostalCode] = useState(getCurrentUser().postal_code)

  const changeUserPassword = async () => {
    if (
      oldPass !== null &&
      oldPass !== "" &&
      newPass !== null &&
      newPass !== "" &&
      newConfirmPass !== null &&
      newConfirmPass !== ""
    ) {
      if (oldPass !== newPass) {
        if (newPass === newConfirmPass) {
          try {
            const user = await Auth.currentAuthenticatedUser()
            await Auth.changePassword(user, oldPass, newPass)
            setPassCode(false)
            props.handleSnack("Success", true)
          } catch (error) {
            props.handleSnack(error.message, false)
          }
        } else {
          props.handleSnack("Confirmation Password do not match", false)
        }
      } else {
        props.handleSnack("Enter a new password!", false)
      }
    } else {
      props.handleSnack("Inputs spaces cannot be empty!", false)
    }
  }
  const changeUserAttributes = async () => {
    try {
      const update = await Auth.updateUserAttributes(
        await Auth.currentAuthenticatedUser(),
        {
          name: name,
          email: email,
          phone_number: phoneNumber,
          "custom:address_line_1": addressLine1,
          "custom:address_line_2": addressLine2,
          "custom:postal_code": postalCode,
        }
      )
      props.handleSnack(update, true)
    } catch (error) {
      props.handleSnack(error.message, false)
    }
  }

  const logoutHandler = async () => {
    const res = await Auth.signOut()
    console.log(res)
    logout(logger)
    function logger() {
      navigate("/")
    }
  }

  return (
    <section className={profileStyles.detailsContainer}>
      <label className={profileStyles.detailsLabels}>Name</label>
      <input
        className={profileStyles.input}
        value={getCurrentUser().name}
        onChange={event => setName(event.target.value)}
        placeholder="Name"
      />
      <label className={profileStyles.detailsLabels}>Email</label>
      <input
        className={profileStyles.input}
        inputMode="email"
        value={getCurrentUser().email}
        onChange={event => setEmail(event.target.value)}
        placeholder="Email"
      />
      <label className={profileStyles.detailsLabels}>Phone Number</label>
      <input
        className={profileStyles.input}
        inputMode="tel"
        value={getCurrentUser().phone_number}
        onChange={event => setPhoneNumber(event.target.value)}
        placeholder="Phone Number"
      />
      <label className={profileStyles.detailsLabels}>Postal Address</label>
      <input
        className={profileStyles.input}
        placeholder={
          getCurrentUser()["custom:address_line_1"] === null
            ? "Address Line 1"
            : getCurrentUser()["custom:address_line_1"]
        }
        onChange={event => setAddressLine1(event.target.value)}
      />
      <input
        className={profileStyles.input}
        placeholder={getCurrentUser()["custom:address_line_2"]}
        onChange={event => setAddressLine2(event.target.value)}
      />
      <label className={profileStyles.detailsLabels}>
        Postal Code/Zip Code
      </label>
      <input
        className={profileStyles.input}
        inputMode="tel"
        placeholder="Postal/Zip Code"
        value={getCurrentUser()["custom:postal_code"]}
        onChange={event => setPostalCode(event.target.value)}
      />
      {passCode && (
        <>
          <label className={profileStyles.detailsLabels}>Change Password</label>
          <input
            className={profileStyles.input}
            placeholder="Enter Old Password"
            type="password"
            onChange={event => setOldPass(event.target.value)}
          />
          <input
            className={profileStyles.input}
            placeholder="Enter New Password"
            type="password"
            onChange={event => setNewPass(event.target.value)}
          />
          <input
            className={profileStyles.input}
            placeholder="Confirm New Password"
            type="password"
            onChange={event => setNewConfirmPass(event.target.value)}
          />
        </>
      )}
      <button
        type="button"
        onClick={passCode ? changeUserPassword : () => setPassCode(true)}
        className={profileStyles.button}
      >
        <FontAwesomeIcon
          icon={faKey}
          size="lg"
          color="#db2626"
          style={{ marginRight: "5px" }}
        />
        CHANGE PASSWORD
      </button>

      <button
        type="button"
        onClick={logoutHandler}
        className={profileStyles.logoutButton}
      >
        Logout
      </button>
    </section>
  )
}
