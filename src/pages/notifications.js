import React, { useEffect, useState } from "react"
import notificationStyles from "./notifications.module.css"
import Layout from "../components/layout"
import { API, graphqlOperation } from "aws-amplify"
import * as subscriptions from "../graphql/subscriptions"
import * as queries from "../graphql/queries"
import { awsNotificationConfig } from "../aws-exports"

API.configure(awsNotificationConfig)

const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState([])

  useEffect(() => {
    refetchQl()
  }, [])

  useEffect(() => {
    const onCreateSubscription = API.graphql(
      graphqlOperation(subscriptions.onCreateTodo)
    ).subscribe({
      next: data => {
        console.log(data.value.data)
        refetchQl()
      },
      error: err => console.log(err),
    })

    const onUpdateSubscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateTodo)
    ).subscribe({
      next: data => {
        console.log(data.value.data)
        refetchQl()
      },
      error: err => console.log(err)
    })
  }, [])

  async function refetchQl() {
    try {
      const notifications = await API.graphql({
        query: queries.listNotifications,
      })
      setNotificationsList(notifications.data.listTodos.items)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      {notificationsList.map((item, id) => (
        <section key={id} className={notificationStyles.cardContainer}>
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
