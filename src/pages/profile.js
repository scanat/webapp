import React, { useEffect, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { getCurrentUser } from "../utils/auth"
import UserDetails from "../components/profile/userDetails"
import { navigate } from "gatsby"
import AWS from "aws-sdk"
import Modules from "../components/profile/modules"

const subscriberDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
  apiVersion: "2012-08-10",
  accessKeyId: process.env.GATSBY_SUBSCRIBERPAGE_DB_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_SUBSCRIBERPAGE_DB_SECRET_ACCESS_KEY,
})

export default function Profile() {
  const [user, setUser] = useState({})
  const [portalContent, setPortalContent] = useState()
  const [refreshModules, setRefreshModules] = useState([])

  useEffect(() => {
    fetchAllModules()
  }, [refreshModules])

  useEffect(() => {
    setUser()
  }, [getCurrentUser()])

  async function fetchAllModules() {
    try {
      const params = {
        TableName: "subscribers",
        Key: {
          phoneNumber: getCurrentUser().phone_number,
        },
        AttributesToGet: ["modules"],
      }
      await subscriberDb.get(params, (err, data) => {
        data && setRefreshModules(data.Item.modules)
        console.log(err, data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const Portal = props => {
    if (props.content === "Business Details")
      return (
        <section className={profileStyles.portalContainer}>
          <UserDetails />
          <section
            className={profileStyles.closeClickSection}
            onClick={props.switchPortal}
            onMouseUp={props.switchPortal}
          ></section>
        </section>
      )
    else if (props.content === "My Modules")
      return (
        <section className={profileStyles.portalContainer}>
          <Modules />
          <section
            className={profileStyles.closeClickSection}
            onClick={props.switchPortal}
            onMouseUp={props.switchPortal}
          ></section>
        </section>
      )
    return null
  }

  const navigateToLive = () => {
    if (typeof window !== "undefined") {
      var dataOrg = getCurrentUser().name
      var dataId = String(getCurrentUser().phone_number).replace("+91", "")
      var encodedId = window.btoa(dataId)

      const orgActiveUrl = `https://www.scanat.in?org=${dataOrg}&pn=${encodedId}`

      window.location.href = orgActiveUrl
    }
  }

  const openPortal = content => {
    setPortalContent(content)
  }

  const handleCardClick = card => {
    card === "Business Details" && setPortalContent(card)
    card === "My Modules" && setPortalContent(card)
    card === "Portfolio" && navigate("/pro/portfolio")
    card === "Products" && navigate("/pro/components/card-input-layouts/category-basic")
    card === "Live Orders" && navigate("/pro/orders")
    card === "QR Codes" && navigate("/pro/qrCodes")
    card === "Employee Management" && navigate("/pro/employeeManagement")
  }

  return (
    <Layout>
      <section className={profileStyles.container}>
        <section className={profileStyles.subContainer}>
          {refreshModules.map((item, id) => (
            <ProfileCard>
              <section
                key={id}
                className={profileStyles.cardChild}
                onClick={() => handleCardClick(item.name)}
              >
                <h1 className={profileStyles.cardTopic}>
                  {getCurrentUser()["custom:category"]} {item.name}
                </h1>
              </section>
            </ProfileCard>
          ))}
          {/* <ProfileCard>
            <section
              className={profileStyles.cardChild}
              onClick={() =>
                navigate("/pro/components/card-input-layouts/category-basic")
              }
            >
              <h1 className={profileStyles.cardTopic}>
                {getCurrentUser()["custom:category"]} Products
              </h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section
              className={profileStyles.cardChild}
              onClick={navigateToLive}
            >
              <h1 className={profileStyles.cardTopic}>
                {getCurrentUser()["custom:category"]} Live
              </h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section
              className={profileStyles.cardChild}
              onClick={() => navigate("/pro/qrCodes")}
            >
              <h1 className={profileStyles.cardTopic}>
                {getCurrentUser()["custom:category"]} QR Codes
              </h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section className={profileStyles.cardChild}>
              <h1 className={profileStyles.cardTopic}>
                {getCurrentUser()["custom:category"]} Live Space
              </h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section
              className={profileStyles.cardChild}
              onClick={() => navigate("/pro/orders")}
            >
              <h1 className={profileStyles.cardTopic}>
                {getCurrentUser()["custom:category"]} Live Orders
              </h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section
              className={profileStyles.cardChild}
              onClick={() => navigate("/pro/employeeManagement")}
            >
              <h1 className={profileStyles.cardTopic}>Employee Management</h1>
            </section>
          </ProfileCard> */}
        </section>
      </section>

      <Portal content={portalContent} switchPortal={() => setPortalContent()} />
    </Layout>
  )
}

const ProfileCard = ({ children }) => {
  return <section className={profileStyles.card}>{children}</section>
}
