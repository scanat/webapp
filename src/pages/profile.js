import React, { useEffect, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { faSignOutAlt, faUserEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey, faPenAlt } from "@fortawesome/free-solid-svg-icons"
import { navigate, useStaticQuery } from "gatsby"
import { Auth } from "aws-amplify"
import { getCurrentUser, logout } from "../utils/auth"
import SwipeableViews from "react-swipeable-views"
import tmpImage from "../images/stores.png"

const Profile = () => {
  const [viewIndex, setViewIndex] = useState(0)
  const [snackMessage, setSnackMessage] = useState()
  const [snackError, setSnackError] = useState()

  useEffect(() => {
    setTimeout(() => {
      setSnackMessage()
    }, 5000)
  }, [snackMessage, snackError])

  const snackHandler = (msg, err) => {
    setSnackMessage(msg)
    setSnackError(err)
  }

  return (
    <Layout>
      <nav>
        <ul>
          <li
            onClick={() => setViewIndex(0)}
            style={{
              textDecoration:
                viewIndex === 0 && "underline whitesmoke solid 1px",
              color: viewIndex === 0 && "white",
            }}
          >
            Directory
          </li>
          <li
            onClick={() => setViewIndex(1)}
            style={{
              textDecoration:
                viewIndex === 1 && "underline whitesmoke solid 1px",
              color: viewIndex === 0 && "white",
            }}
          >
            Order History
          </li>
          <li
            onClick={() => setViewIndex(2)}
            style={{
              textDecoration:
                viewIndex === 2 && "underline whitesmoke solid 1px",
              color: viewIndex === 0 && "white",
            }}
          >
            Profile
          </li>
        </ul>
      </nav>
      <SwipeableViews index={viewIndex}>
        <Directory />
        <OrderHistory currentUser={getCurrentUser()} />
        <UserDetails handleSnack={(msg, err) => snackHandler(msg, err)} />
      </SwipeableViews>
    </Layout>
  )
}

export default Profile

const ProfileCard = ({ children }) => {
  return <section className={profileStyles.card}>{children}</section>
}

const DirectoryCard = props => {
  return (
    <section className={profileStyles.directoryCardContainer}>
      <img className={profileStyles.logo} src={props.image} alt="" />
      <section className={profileStyles.content}>
        <h1>{props.name}</h1>
        <label> - {props.pageId}</label>
      </section>
    </section>
  )
}
const directoryList = [
  {
    name: "Chit Chaat Corner",
    pageId: "chitchaatcorner",
    image: tmpImage,
  },
  {
    name: "Chit Chaats",
    pageId: "chitchaats",
    image: tmpImage,
  },
  {
    name: "Chaat Corner",
    pageId: "chitcorner",
    image: tmpImage,
  },
  {
    name: "Delo Retro",
    pageId: "deloretro",
    image: tmpImage,
  },
]

const Directory = () => {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(directoryList)
  }, [])
  return (
    <section className={profileStyles.detailsContainer}>
      {list.map(item => (
        <DirectoryCard
          name={item.name}
          pageId={item.pageId}
          image={item.image}
        />
      ))}
    </section>
  )
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

const OrderHistoryCard = props => {
  return (
    <section className={profileStyles.orderContent}>
      <h1>{props.name}</h1>
      <label className={profileStyles.smallText}>Date - {props.date}</label>
      <label className={profileStyles.smallText}>
        Total - Rs. {props.total} /-
      </label>
      <label>STATUS - {props.status}</label>
    </section>
  )
}
const orderList = [
  {
    name: "Chit Chaat Corner",
    date: "10/01/2020",
    total: "340",
    status: "complete",
  },
  {
    name: "Retro Pool",
    date: "12/01/2020",
    total: "80",
    status: "complete",
  },
  {
    name: "Chit Chaats",
    date: "13/01/2020",
    total: "210",
    status: "canceled",
  },
  {
    name: "Chaat Corner",
    date: "13/01/2020",
    total: "240",
    status: "approved",
  },
  {
    name: "Delo Retro",
    date: "13/01/2020",
    total: "140",
    status: "complete",
  },
]

const OrderHistory = () => {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(orderList)
  }, [])

  return (
    <section className={profileStyles.detailsContainer}>
      {list.map(item => (
        <OrderHistoryCard
          name={item.name}
          date={item.date}
          total={item.total}
          status={item.status}
        />
      ))}
    </section>
  )
}
