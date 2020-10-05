import React, { useEffect, useState } from "react"
import notificationStyles from "./notifications.module.css"
import Layout from "../components/layout"

const Notifications = () => {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(testList)
  }, [])

  return (
    <Layout>
      {list.map(item => (
        <NotificationCard topic={item.topic} desc={item.desc} />
      ))}
    </Layout>
  )
}

export default Notifications

const NotificationCard = props => {
  return (
    <section className={notificationStyles.cardContainer}>
      <section className={notificationStyles.topicSpace}>
        <h1>{props.topic}</h1>
      </section>
      <section className={notificationStyles.contentSpace}>
        <p>{props.desc}</p>
      </section>
    </section>
  )
}

const testList = [
  {
    topic: "Welcome dear",
    desc:
      "Scan At welcomes you to the brand new adventure of exploration, at the cheapest guaranteed.",
  },
  {
    topic: "Hot Updates",
    desc:
      "The restaurants have opened up! Its time to party!.",
  },
  {
    topic: "Pay less, do more",
    desc:
      "We have covered you with more reach. Now get Restaurants, Hotels and your near by stores digitalised for you",
  },
]
