import React, { useEffect, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { getCurrentUser } from "../utils/auth"
import UserDetails from "../components/profile/userDetails"
import { navigate } from "gatsby"

export default function Profile() {
  const [user, setUser] = useState({})
  const [portalContent, setPortalContent] = useState()

  const Portal = props => {
    if (props.content === "details")
      return (
        <section className={profileStyles.portalContainer}>
          <UserDetails />
          <section className={profileStyles.closeClickSection} onClick={props.switchPortal}></section>
        </section>
      )
    return null
  }

  const navigateToLive = () => {
    if (typeof window !== "undefined") {
      var dataOrg = getCurrentUser().name
      var dataId = String(getCurrentUser().phone_number).replace('+91', "")
      console.log(dataOrg + dataId)
      var encodedOrg = window.btoa(dataOrg)
      var encodedId = window.btoa(dataId)

      const orgActiveUrl = `https://www.scanat.in/live/org-display?org=${encodedOrg}&pn=${encodedId}`

      window.location.href = orgActiveUrl
    }
  }

  useEffect(() => {
    setUser()
  }, [getCurrentUser()])

  const openPortal = content => {
    setPortalContent(content)
  }

  return (
    <Layout>
      <section className={profileStyles.container}>
        <section className={profileStyles.subContainer}>
          <ProfileCard>
            <section
              className={profileStyles.cardChild}
              onClick={() => openPortal("details")}
            >
              <h1 className={profileStyles.cardTopic}>User Details</h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section className={profileStyles.cardChild} onClick={() => navigate('/pro/components/card-input-layouts/basic')}>
              <h1 className={profileStyles.cardTopic}>
                {getCurrentUser()["custom:category"]} Products
              </h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section className={profileStyles.cardChild} onClick={navigateToLive}>
              <h1 className={profileStyles.cardTopic}>
                {getCurrentUser()["custom:category"]} Live
              </h1>
            </section>
          </ProfileCard>
          <ProfileCard>
            <section className={profileStyles.cardChild} onClick={() => navigate('/pro/qrCodes')}>
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
            <section className={profileStyles.cardChild}>
              <h1 className={profileStyles.cardTopic}>My Profile</h1>
            </section>
          </ProfileCard>
        </section>
      </section>

      <Portal content={portalContent} switchPortal={() => setPortalContent()} />
    </Layout>
  )
}

const ProfileCard = ({ children }) => {
  return <section className={profileStyles.card}>{children}</section>
}
