import React, { useEffect, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { getCurrentUser } from "../utils/auth"
import UserDetails from "../components/profile/userDetails"
import { navigate } from "gatsby"
import AWS from "aws-sdk"
import Modules from "../components/profile/modules"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import awsmobile from "../aws-exports"

Amplify.configure(awsmobile)

export default function Profile() {
  const [portalContent, setPortalContent] = useState()
  const [refreshModules, setRefreshModules] = useState([])

  useEffect(() => {
    fetchAllModules()
  }, [refreshModules])

  async function fetchAllModules() {
    try {
      const mods = await API.graphql(
        graphqlOperation(getCategory, {
          id: getCurrentUser()["custom:page_id"],
        })
      )
      if (mods) {
        const modules = await API.graphql(
          graphqlOperation(getModules, { id: mods.data.getSubscriber.category })
        )

        setRefreshModules(modules.data.getGlobalTable.modules)
      }
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
    card === "Products" &&
      navigate("/pro/components/card-input-layouts/category-basic")
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
                <label style={{ fontSize: "0.8em", margin: 5, color: "grey" }}>
                  {item.description}
                </label>
              </section>
            </ProfileCard>
          ))}
        </section>
      </section>

      <Portal content={portalContent} switchPortal={() => setPortalContent()} />
    </Layout>
  )
}

const ProfileCard = ({ children }) => {
  return <section className={profileStyles.card}>{children}</section>
}

export const getCategory = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      category
    }
  }
`;
export const getModules = /* GraphQL */ `
  query GetGlobalTable($id: ID!) {
    getGlobalTable(id: $id) {
      modules {
        name
        description
        default
        price
      }
    }
  }
`;