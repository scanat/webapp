import Amplify, { API, graphqlOperation } from "aws-amplify"
import React, { useState } from "react"
import confirmOrderStyles from "./confirmOrder.module.css"

Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const ConfirmOrder = props => {
  const [message, setMessage] = useState("")

  const calculateTotal = () => {
    var total = 0
    props.orderList.forEach(item => {
      total += Number(item.itemPrice) * item.qty
    })
    return total
  }

  const sendOrderRequest = async () => {
    let orders = []
    props.orderList.forEach(item => {
      orders.push({
        name: item.itemName,
        qty: item.qty,
        price: item.itemPrice,
        rating: null,
      })
    })
    try {
      const params = {
        input: {
          id: `ORD-${props.id}-${new Date().toISOString()}`,
          order: orders,
          totalItems: orders.length,
          totalPrice: calculateTotal(),
          states: [
            { state: "Requested Confirmation", time: new Date().toISOString() },
          ],
          rating: null,
          request: message,
          status: "Requested Confirmation",
        },
      }
      await API.graphql(graphqlOperation(createOrders, params)).then(res => {
        res && props.getConfData(params)
        getOrders(params.input.id)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getOrders = async (orderId) => {
    try {
      let params = {
        id: props.id,
      }
      await API.graphql(graphqlOperation(getSubscriber, params)).then(res => {
        let data = res.data.getSubscriber.orders ? res.data.getSubscriber.orders : []
        sendOrderCopy(orderId, data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const sendOrderCopy = async (orderId, resultOrders) => {
    resultOrders.push(orderId)
    try {
      let params = {
        input: {
          id: props.id,
          orders: resultOrders
        },
      }
      await API.graphql(graphqlOperation(updateSubscriber, params)).then(res =>
        console.log(res)
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={confirmOrderStyles.billContainer}>
      <secion className={confirmOrderStyles.billHolder}>
        <h4 className={confirmOrderStyles.confirmTopic}>
          Please confirm the order below
        </h4>
        {props.orderList.map(item => (
          <section className={confirmOrderStyles.orderItems}>
            <p className={confirmOrderStyles.orderItemName}>
              <b>{item.itemName}</b>{" "}
              <label className={confirmOrderStyles.qtyLabel}>
                x {item.qty}
              </label>
            </p>
            <p>{item.itemPrice * item.qty}/-</p>
          </section>
        ))}
        <section className={confirmOrderStyles.orderFinalItems}>
          <p>
            <b>Total</b>
          </p>
          <p>
            Rs. <b>{calculateTotal()}</b> /-
          </p>
        </section>

        <section>
          <input
            type="textarea"
            placeholder="Any special requests..."
            className={confirmOrderStyles.message}
            onChange={e => setMessage(e.target.value)}
          />
        </section>

        <p className={confirmOrderStyles.infoText}>
          * All prices are exclusive of GST <br />
          <u>We will pass on your order with the reception</u>
        </p>
        <button
          type="button"
          className={confirmOrderStyles.requestButton}
          onClick={sendOrderRequest}
        >
          Request Order
        </button>
      </secion>
      <section
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: -1,
        }}
        onClick={props.switchConfirmOrder}
      ></section>
    </section>
  )
}

export default ConfirmOrder

export const createOrders = /* GraphQL */ `
  mutation CreateOrders($input: CreateOrdersInput!) {
    createOrders(input: $input) {
      id
    }
  }
`

export const updateSubscriber = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      id
      orders
    }
  }
`

export const getSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      orders
    }
  }
`
