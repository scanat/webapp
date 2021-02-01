import React, { useState, useEffect } from "react"
import detailStyles from "./userDetails.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faKey, faPenAlt } from "@fortawesome/free-solid-svg-icons"
import Amplify, { API, Auth, graphqlOperation, input } from "aws-amplify"
import { getCurrentUser } from "../../utils/auth"
import awsmobile from "../../aws-exports"
import Layout from "../layout"
import Loader from "../loader"

Amplify.configure(awsmobile)

const DetailsCard = ({ children }) => {
  return <section className={detailStyles.card}>{children}</section>
}

const UserDetails = () => {
  const [passCode, setPassCode] = useState(false)
  const [oldPass, setOldPass] = useState()
  const [newPass, setNewPass] = useState()
  const [newConfirmPass, setNewConfirmPass] = useState()
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
  const [errmsg, setErrmsg] = useState(null)
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [locality, setLocality] = useState("")
  const [postalCode, setPostalCode] = useState(getCurrentUser().postal_code)
  const [userData, setUserData] = useState({
    address1: "",
    address2: "",
    locality: "",
    city: "",
    state: "",
    postal_code: "",
  })
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    setLoading(true)
    try {
      let params = {
        id: getCurrentUser()["custom:page_id"],
      }
      console.log(await Auth.currentAuthenticatedUser())
      await Auth.currentAuthenticatedUser().then(async res => {
        setUserData({
          address1: res.attributes["custom:address_line_1"],
          address2: res.attributes["custom:address_line_2"],
          locality: res.attributes["custom:locality"],
          city: res.attributes["custom:city"],
          state: res.attributes["custom:state"],
          postal_code: res.attributes["custom:postal_code"],
        })
        setAddressLine1(res.attributes["custom:address_line_1"])
        setAddressLine2(res.attributes["custom:address_line_2"])
        setCity(res.attributes["custom:city"])
        setLocality(res.attributes["custom:locality"])
        setState(res.attributes["custom:state"])
        setPostalCode(res.attributes["custom:postal_code"])
        await API.graphql(graphqlOperation(getSubscriber, params)).then(res =>
          setLocation({
            latitude: res.data.getSubscriber.latitude,
            longitude: res.data.getSubscriber.longitude,
          })
        )
      })
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const changeUserPassword = async () => {
    setLoading(true)
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
          } catch (error) {}
        } else {
          // snackHandler("Confirmation Password do not match", false)
        }
      } else {
        // snackHandler("Enter a new password!", false)
      }
    } else {
      // snackHandler("Inputs spaces cannot be empty!", false)
    }
    setLoading(false)
  }

  const changeUserAttributes = async () => {
    setErrmsg(null)
    setLoading(true)
    try {
      await Auth.updateUserAttributes(await Auth.currentAuthenticatedUser(), {
        name: name,
        email: email,
        phone_number: phoneNumber,
        "custom:address_line_1": addressLine1,
        "custom:address_line_2": addressLine2,
        "custom:locality": locality,
        "custom:city": city,
        "custom:state": state,
        "custom:postal_code": postalCode,
      }).then(async res => {
        if (location) {
          try {
            let inputs = {
              input: {
                id: getCurrentUser()["custom:page_id"],
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
            }
            await API.graphql(
              graphqlOperation(updateSubscriber, inputs)
            ).then(result => console.log(result))
          } catch (error) {
            console.log(error)
          }
        }
        setErrmsg("Details updated.")
      })
      // snackHandler(update, true)
    } catch (error) {
      // snackHandler(error.message, false)
    }
    setLoading(false)
  }

  const getGeolocation = () => {
    if (typeof window !== "undefined")
      window.navigator.geolocation.getCurrentPosition(res => setLocation(res))
  }

  return (
    <Layout>
      <Loader loading={loading} />
      <section id="cardContainer" className={detailStyles.cardContainer}>
        <section className={detailStyles.detailsContainer}>
          <label className={detailStyles.detailsLabels}>Name</label>
          <input
            className={detailStyles.input}
            placeholder={getCurrentUser().name}
            onChange={event => setNickName(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>Phone Number</label>
          <input
            className={detailStyles.input}
            inputMode="tel"
            placeholder={getCurrentUser().phone_number}
            onChange={event => setPhoneNumber(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>Postal Address</label>
          <input
            className={detailStyles.input}
            placeholder={
              userData.address1 ? userData.address1 : "Unit/Block Number"
            }
            onChange={event => setAddressLine1(event.target.value)}
          />
          <input
            className={detailStyles.input}
            placeholder={
              userData.address2 ? userData.address2 : "Street Name/Number"
            }
            onChange={event => setAddressLine2(event.target.value)}
          />
          <input
            className={detailStyles.input}
            placeholder={userData.locality ? userData.locality : "Locality"}
            onChange={event => setLocality(event.target.value)}
          />
          <input
            className={detailStyles.input}
            placeholder={userData.city ? userData.city : "City"}
            onChange={event => setCity(event.target.value)}
          />
          <input
            className={detailStyles.input}
            placeholder={userData.state ? userData.state : "State"}
            onChange={event => setState(event.target.value)}
          />
          <label className={detailStyles.detailsLabels}>
            Postal Code/Zip Code
          </label>
          <input
            className={detailStyles.input}
            inputMode="tel"
            placeholder={
              userData.postal_code ? userData.postal_code : "Postal/Zip Code"
            }
            onChange={event => setPostalCode(event.target.value)}
          />
          {errmsg && (
            <label className={detailStyles.errMsg}>
              {errmsg}
              {getCurrentUser()["custom:page_id"]}
            </label>
          )}
          <section
            style={{
              width: "170px",
              border: "#e1e1e1 1px solid",
              borderRadius: "8px",
              height: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "15px 0",
            }}
          >
            <label style={{ fontSize: "0.8em", color: "grey", margin: "5px" }}>
              {location ? "Located" : "Set Location"}
            </label>
            <img
              src={require("../../images/icons/geolocation.png")}
              style={{ width: "18px", marginRight: "5px" }}
              onClick={getGeolocation}
            />
          </section>
          
          <button
            type="button"
            onClick={changeUserAttributes}
            className={detailStyles.button}
          >
            Update Details
          </button>
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
            onMouseUp={passCode ? changeUserPassword : () => setPassCode(true)}
            className={detailStyles.button}
          >
            CHANGE PASSWORD
          </button>
        </section>
      </section>
    </Layout>
  )
}

export default UserDetails

export const getSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      address1
      address2
      city
      state
      postalCode
      latitude
      longitude
    }
  }
`
export const updateSubscriber = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      id
    }
  }
`
