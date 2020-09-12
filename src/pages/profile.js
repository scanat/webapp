import React, { useEffect, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { faUserEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey, faPenAlt } from "@fortawesome/free-solid-svg-icons"
import { navigate } from "gatsby"
import {Auth} from 'aws-amplify'
import { getCurrentUser } from "../utils/auth"
import SnackBar from "../components/snackBar"

const ProfileCard = ({ children }) => {
  return <section className={profileStyles.card}>{children}</section>
}

const UserDetails = props => {
  const [passCode, setPassCode] = useState(false)
  const [oldPass, setOldPass] = useState()
  const [newPass, setNewPass] = useState()
  const [newConfirmPass, setNewConfirmPass] = useState()
  const [enableEdit, setEnableEdit] = useState(false)
  const [name, setName] = useState(getCurrentUser().name)
  const [email, setEmail] = useState(getCurrentUser().email)
  const [phoneNumber, setPhoneNumber] = useState(getCurrentUser().phone_number)
  const [addressLine1, setAddressLine1] = useState(
    getCurrentUser().address_line_1
  )
  const [addressLine2, setAddressLine2] = useState(
    getCurrentUser().address_line_1
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

  return (
    <ProfileCard>
      <section className={profileStyles.cardContainer}>
        <h1>
          <u style={{ margin: "0 50px" }}>Your Details</u>
          <FontAwesomeIcon
            icon={faUserEdit}
            color={enableEdit ? "#db2626" : "green"}
            size="lg"
            onClick={() =>
              enableEdit ? setEnableEdit(false) : setEnableEdit(true)
            }
            className={profileStyles.editAttributeButton}
          />
        </h1>
        <section className={profileStyles.detailsContainer}>
          <label className={profileStyles.detailsLabels}>Name</label>
          <input
            className={profileStyles.input}
            disabled={!enableEdit}
            value={getCurrentUser().name}
            onChange={event => setName(event.target.value)}
          />
          <label className={profileStyles.detailsLabels}>Email</label>
          <input
            className={profileStyles.input}
            disabled={!enableEdit}
            inputMode="email"
            value={getCurrentUser().email}
            onChange={event => setEmail(event.target.value)}
          />
          <label className={profileStyles.detailsLabels}>Phone Number</label>
          <input
            className={profileStyles.input}
            disabled={!enableEdit}
            inputMode="tel"
            value={getCurrentUser().phone_number}
            onChange={event => setPhoneNumber(event.target.value)}
          />
          <label className={profileStyles.detailsLabels}>Postal Address</label>
          <input
            className={profileStyles.input}
            disabled={!enableEdit}
            placeholder="Address Line 1"
            value={getCurrentUser()["custom:address_line_1"]}
            onChange={event => setAddressLine1(event.target.value)}
          />
          <input
            className={profileStyles.input}
            disabled={!enableEdit}
            placeholder="Address Line 2"
            value={getCurrentUser()["custom:address_line_2"]}
            onChange={event => setAddressLine2(event.target.value)}
          />
          <label className={profileStyles.detailsLabels}>
            Postal Code/Zip Code
          </label>
          <input
            className={profileStyles.input}
            disabled={!enableEdit}
            inputMode="tel"
            placeholder="Postal/Zip Code"
            value={getCurrentUser()["custom:postal_code"]}
            onChange={event => setPostalCode(event.target.value)}
          />
          {enableEdit && (
            <button
              type="button"
              onClick={changeUserAttributes}
              className={profileStyles.button}
            >
              <FontAwesomeIcon
                icon={faPenAlt}
                size="lg"
                color="green"
                style={{ marginRight: "5px" }}
              />
              Update Details
            </button>
          )}
          {passCode && (
            <>
              <label className={profileStyles.detailsLabels}>
                Change Password
              </label>
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
        </section>
      </section>
    </ProfileCard>
  )
}

const OrderHistory = () => {
  return (
    <ProfileCard>
      <section className={profileStyles.cardContainer}>
        <h1>
          <u>Order History</u>
        </h1>
      </section>
    </ProfileCard>
  )
}

export default function Profile() {
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
      <section className={profileStyles.container}>
        <UserDetails handleSnack={(msg, err) => snackHandler(msg, err)} />
        <OrderHistory currentUser={getCurrentUser()} />
        {snackMessage && <SnackBar message={snackMessage} err={snackError} />}
      </section>
    </Layout>
  )
}
