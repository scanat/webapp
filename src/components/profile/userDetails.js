import React, { useState, useEffect } from "react"
import detailStyles from "./userDetails.module.css"
import { faUserEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey, faPenAlt } from "@fortawesome/free-solid-svg-icons"
import { Auth } from "aws-amplify"
import { getCurrentUser } from "../../utils/auth"

const DetailsCard = ({ children }) => {
  return <section className={detailStyles.card}>{children}</section>
}

const UserDetails = () => {
  const [passCode, setPassCode] = useState(false)
  const [oldPass, setOldPass] = useState()
  const [newPass, setNewPass] = useState()
  const [newConfirmPass, setNewConfirmPass] = useState()
  const [enableEdit, setEnableEdit] = useState(false)
  const [name, setName] = useState(getCurrentUser().name)
  const [nickName, setNickName] = useState(getCurrentUser()["custom:nick_name"])
  const [email, setEmail] = useState(getCurrentUser().email)
  const [phoneNumber, setPhoneNumber] = useState(getCurrentUser().phone_number)
  const [addressLine1, setAddressLine1] = useState(
    getCurrentUser().address_line_1
  )
  const [addressLine2, setAddressLine2] = useState(
    getCurrentUser().address_line_1
  )
  const [postalCode, setPostalCode] = useState(getCurrentUser().postal_code)
  const [snackMessage, setSnackMessage] = useState()
  const [snackError, setSnackError] = useState()
  const [user, setUser] = useState({})

  useEffect(() => {
    setUser()
  }, [getCurrentUser()])

  useEffect(() => {
    setTimeout(() => {
      setSnackMessage()
    }, 5000)
  }, [snackMessage, snackError])

  const snackHandler = (msg, err) => {
    setSnackMessage(msg)
    setSnackError(err)
  }

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
            snackHandler("Success", true)
          } catch (error) {
            snackHandler(error.message, false)
          }
        } else {
          snackHandler("Confirmation Password do not match", false)
        }
      } else {
        snackHandler("Enter a new password!", false)
      }
    } else {
      snackHandler("Inputs spaces cannot be empty!", false)
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
      snackHandler(update, true)
    } catch (error) {
      snackHandler(error.message, false)
    }
  }

  const toggleEnableEdit = () => {
    enableEdit ? setEnableEdit(false) : setEnableEdit(true)
  }

  return (
    <DetailsCard>
      <section id='cardContainer' className={detailStyles.cardContainer}>
        <h1>
          <u style={{ fontSize: "1.4em", margin: "10px 30px" }}>Your Details</u>
          <FontAwesomeIcon
            icon={faUserEdit}
            color={enableEdit ? "#db2626" : "green"}
            size="lg"
            onClick={toggleEnableEdit}
            className={detailStyles.editAttributeButton}
          />
        </h1>

        <section className={detailStyles.detailsContainer}>
          <label className={detailStyles.detailsLabels}>Name</label>
          <input
            className={detailStyles.input}
            disabled={!enableEdit}
            placeholder={getCurrentUser()["custom:nick_name"]}
            onChange={event => setNickName(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>
            Organization Name
          </label>
          <input
            className={detailStyles.input}
            disabled={!enableEdit}
            placeholder={getCurrentUser().name}
            onChange={event => setName(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>Email</label>
          <input
            className={detailStyles.input}
            disabled={!enableEdit}
            inputMode="email"
            placeholder={getCurrentUser().email}
            onChange={event => setEmail(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>Phone Number</label>
          <input
            className={detailStyles.input}
            disabled={!enableEdit}
            inputMode="tel"
            placeholder={getCurrentUser().phone_number}
            onChange={event => setPhoneNumber(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>Postal Address</label>
          <input
            className={detailStyles.input}
            disabled={!enableEdit}
            placeholder={getCurrentUser()["custom:address_line_1"]}
            onChange={event => setAddressLine1(event.target.value)}
          />
          <input
            className={detailStyles.input}
            disabled={!enableEdit}
            placeholder={getCurrentUser()["custom:address_line_2"]}
            onChange={event => setAddressLine2(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>
            Postal Code/Zip Code
          </label>
          <input
            className={detailStyles.input}
            disabled={!enableEdit}
            inputMode="tel"
            placeholder={getCurrentUser()["custom:postal_code"]}
            onChange={event => setPostalCode(event.target.value)}
          />
          {enableEdit && (
            <button
              type="button"
              onClick={changeUserAttributes}
              className={detailStyles.button}
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
              <label className={detailStyles.detailsLabels}>
                Change Password
              </label>
              <input
                className={detailStyles.input}
                placeholder="Enter Old Password"
                type="password"
                onChange={event => setOldPass(event.target.value)}
              />
              <input
                className={detailStyles.input}
                placeholder="Enter New Password"
                type="password"
                onChange={event => setNewPass(event.target.value)}
              />
              <input
                className={detailStyles.input}
                placeholder="Confirm New Password"
                type="password"
                onChange={event => setNewConfirmPass(event.target.value)}
              />
            </>
          )}
          <button
            type="button"
            onClick={passCode ? changeUserPassword : () => setPassCode(true)}
            className={detailStyles.button}
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
    </DetailsCard>
  )
}

export default UserDetails
