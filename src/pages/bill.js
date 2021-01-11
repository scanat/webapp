import { API, graphqlOperation } from "aws-amplify"
import React, { useEffect, useState } from "react"
import billStyles from "./bill.module.css"
import Layout from "../components/layout"

const Bill = ({ location }) => {
  const [orderlist, setOrderlist] = useState([])
  const [ordered, setOrdered] = useState({ totalItems: null, totalPrice: null })

  useEffect(async () => {
    if (new URLSearchParams(location.search).get("id")) {
      let params = {
        id: new URLSearchParams(location.search).get("id"),
      }
      try {
        await API.graphql(graphqlOperation(getOrders, params)).then(res => {
          setOrderlist(res.data.getOrders.order)
          setOrdered({
            totalItems: res.data.getOrders.totalItems,
            totalPrice: res.data.getOrders.totalPrice,
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  const phonePay = () => {
    fetch("http://mercury-uat.phonepe.com", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      // body: {
      //   merchantId: "UATMERCHANT",
      //   key: "8289e078-be0b-484d-ae60-052f117f8deb",
      // }
    })
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <Layout>
      <section className={billStyles.container}>
        {orderlist.map((item, index) => (
          <section key={index} className={billStyles.itemsHolder}>
            <h4>
              {item.name} x <label>{item.qty}</label>
            </h4>
            <label>Rs. {item.price} /-</label>
          </section>
        ))}
        <section className={billStyles.totalContainer}>
          <label>Total items</label>
          <label>{ordered.totalItems}</label>
        </section>
        <section className={billStyles.totalContainer}>
          <label>Total price</label>
          <label>Rs. {ordered.totalPrice} /-</label>
        </section>

        <section className={billStyles.paymentContainer}>
          <button onClick={phonePay}>
            <img src={require("../images/icon/phonepe.png")} />
          </button>
          <button>
            <img src={require("../images/icon/googlepay.png")} />
          </button>
        </section>
      </section>
    </Layout>
  )
}

export default Bill

export const getOrders = /* GraphQL */ `
  query GetOrders($id: ID!) {
    getOrders(id: $id) {
      order {
        name
        qty
        price
        rating
      }
      totalItems
      totalPrice
    }
  }
`
