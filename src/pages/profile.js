import React, { useEffect, useState } from "react"
import profileStyles from "./profile.module.css"
import Layout from "../components/layout"
import { faUserEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { navigate } from "gatsby"
import { getCurrentUser } from "../utils/auth"

const ProfileCard = ({ children }) => {
  return <section className={profileStyles.card}>{children}</section>
}

const BusinessDeal = () => {
  const joinUs = () => {
    navigate("/admin/login")
  }

  return (
    <ProfileCard>
      <section className={profileStyles.cardContainer}>
        <h1>Get your business up and running!</h1>
        <h2>Its free!</h2>
        <button
          type="button"
          onClick={joinUs}
          className={profileStyles.buttonJoinUs}
        >
          JOIN US!
        </button>
      </section>
    </ProfileCard>
  )
}

const UserDetails = () => {
  return (
    <ProfileCard>
      <section className={profileStyles.cardContainer}>
        <h1>
          <u style={{ margin: "0 50px" }}>Your Details</u>
          <FontAwesomeIcon icon={faUserEdit} color="darkorange" size="lg" />
        </h1>
        <table className={profileStyles.userDetailsTable}>
          <tr>
            <td>Username</td>
            <td>{getCurrentUser().name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{getCurrentUser().email}</td>
          </tr>
        </table>
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
  return (
    <Layout>
      <section className={profileStyles.container}>
        <BusinessDeal />
        <UserDetails />
        <OrderHistory currentUser={getCurrentUser()} />
        <section></section>
      </section>
    </Layout>
  )
}
