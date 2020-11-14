import React, { useState, useEffect } from "react"
import Layout from "../layout"
import { getCurrentUser } from "../../utils/auth"
import orderStyles from "./orders.module.css"
import config from "../../config.json"
import axios from "axios"
import SnackBar from "../snackBar"
import { API, graphqlOperation } from "aws-amplify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"

const Orders = () => {
  const [seqQrs, setSeqQrs] = useState([])
  const [customQrs, setCustomQrs] = useState([])
  const [portfolioOrders, setPortfolioOrders] = useState(0)
  const [restaurantOrders, setRestaurantOrders] = useState(0)
  const [hotelOrders, setHotelOrders] = useState(0)

  useEffect(() => {
    API.graphql(graphqlOperation(onUpdateSubscriber)).subscribe({
      next: data => {
        if (
          getCurrentUser()["custom:page_id"] ===
          data.value.data.onUpdateSubscriber.id
        ) {
          console.log(data.value.data.onUpdateSubscriber.orders)
          let portfolioTemp = 0
          let restaurantTemp = 0
          let hotelTemp = 0
          data.value.data.onUpdateSubscriber.orders.forEach(element => {
            if (!element.key) {
              portfolioTemp++
              setPortfolioOrders(portfolioTemp)
            }
          })
        }
      },
      error: err => {
        console.log(err)
      },
    })
  }, [])
  useEffect(() => {
    getSubscribersQrs()
  }, [])

  const getSubscribersQrs = async () => {
    try {
      const params = {
        id: getCurrentUser()["custom:page_id"],
      }
      await API.graphql(graphqlOperation(getSubscriber, params)).then(res => {
        console.log(res)
        let temp = seqQrs
        temp.length = res.data.getSubscriber.seqQr
        temp.fill("")
        setSeqQrs(temp)
        setCustomQrs(res.data.getSubscriber.customQr)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <h1 className={orderStyles.topic}>Live Orders</h1>
      <section className={orderStyles.portfolioOrders}>
        <h1 style={{ position: "relative" }}>
          Portfolio Orders
          {portfolioOrders > 0 && <FontAwesomeIcon
            icon={faCircle}
            color="crimson"
            size="xs"
            style={{ position: "absolute", top: -10, right: -10, width: 8 }}
          />}
        </h1>
      </section>
      <section className={orderStyles.gridContainer}>
        {seqQrs.map((item, id) => (
          <section className={orderStyles.orderGrid}>
            <h1>{id + 1}</h1>
            <label style={{ fontSize: "0.7em", color: "#169188" }}>
              Restaurant
            </label>
          </section>
        ))}
        {customQrs.map((item, id) => (
          <section className={orderStyles.orderGrid} key={id}>
            <h1>{item}</h1>
            <label style={{ fontSize: "0.7em", color: "crimson" }}>Hotel</label>
          </section>
        ))}
      </section>
    </Layout>
  )
}

export default Orders

export const getSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      seqQr
      customQr
    }
  }
`

export const onUpdateSubscriber = /* GraphQL */ `
  subscription OnUpdateSubscriber {
    onUpdateSubscriber {
      id
      orders
    }
  }
`
