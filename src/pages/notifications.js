import React, { useEffect, useState } from "react"
import notificationStyles from "./notifications.module.css"
import Layout from "../components/layout"
import { API, graphqlOperation } from "aws-amplify"
import { awsmobile } from "../aws-exports"

API.configure(awsmobile)

const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState([{id: 123, topic: "Topic", description: "Description"}])

  return (
    <Layout>
      {notificationsList.map((item, id) => (
        <section key={item.id} className={notificationStyles.cardContainer}>
          <section className={notificationStyles.topicSpace}>
            <h1>{item.topic}</h1>
          </section>
          <section className={notificationStyles.contentSpace}>
            <p>{item.description}</p>
          </section>
        </section>
      ))}
    </Layout>
  )
}

export default Notifications
