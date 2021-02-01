import React, { useEffect, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { getCurrentUser, logout } from "../utils/auth"
import Loader from "../components/loader"
import UserDetails from "../components/profile/userDetails"
import { navigate } from "gatsby"
import Modules from "../components/profile/modules"
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify"
import awsmobile from "../aws-exports"

Amplify.configure(awsmobile)

const Profile = () => {
  const [refreshModules, setRefreshModules] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllModules()
  }, [])

  async function fetchAllModules() {
    setLoading(true)
    try {
      await API.graphql(
        graphqlOperation(getCategory, {
          id: getCurrentUser()["custom:page_id"],
        })
      ).then(async res => {
        if (res.data.getSubscriber) {
          await API.graphql(
            graphqlOperation(getModules, {
              id: res.data.getSubscriber.category,
            })
          ).then(result => {
            setRefreshModules(result.data.getGlobalTable.modules)
            setLoading(false)
          })
        }
      })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleCardClick = card => {
    card === "Business Details" && navigate(`/pro/portal?id=businessdetails`)
    card === "My Modules" && navigate(`/pro/portal?id=modules`)
    card === "Portfolio" && navigate(`/pro/portal?id=portfolio`)
    card === "Products" && navigate(`/pro/portal?id=products`)
    card === "Live Order" && navigate(`/pro/portal?id=liveorders`)
    card === "QR Code" && navigate(`/pro/portal?id=qrcodes`)
    card === "Employee Management" &&
      navigate(`/pro/portal?id=employeemanagement`)
    card === "Business Hours" && navigate(`/pro/portal?id=timing`)
    card === "Posts" && navigate(`/pro/portal?id=posts`)
  }

  async function logoutHandler() {
    await Auth.signOut().then(res => res && logout(logger))
    function logger() {
      navigate("/")
    }
  }

  return (
    <Layout>
      <Loader loading={loading} />
      <section className={profileStyles.container}>
        <section className={profileStyles.subContainer}>
          {refreshModules.map(
            (item, id) =>
              item.status && (
                <ProfileCard key={id}>
                  <section
                    key={id}
                    className={profileStyles.cardChild}
                    onClick={() => handleCardClick(item.name)}
                  >
                    <h1 className={profileStyles.cardTopic}>
                      {getCurrentUser()["custom:category"]} {item.name}
                    </h1>
                    <label
                      style={{ fontSize: "0.8em", margin: 5, color: "grey" }}
                    >
                      {item.description}
                    </label>
                  </section>
                </ProfileCard>
              )
          )}
        </section>
      </section>
      <button className={profileStyles.logoutbtn} onClick={logoutHandler}>
        Logout
      </button>
    </Layout>
  )
}

export default Profile

const ProfileCard = ({ children }) => {
  return <section className={profileStyles.card}>{children}</section>
}

export const getCategory = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      category
    }
  }
`
export const getModules = /* GraphQL */ `
  query GetGlobalTable($id: ID!) {
    getGlobalTable(id: $id) {
      modules {
        name
        description
        default
        price
        status
      }
    }
  }
`
