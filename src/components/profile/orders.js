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
import { element } from "prop-types"

const Orders = () => {
  const [seqQrs, setSeqQrs] = useState([])
  const [customQrs, setCustomQrs] = useState([])
  const [portfolioOrders, setPortfolioOrders] = useState([])

  useEffect(() => {
    getSubscribersQrs()
    getLiveOrders()

    // setInterval(() => {
    //   getLiveOrders()
    // }, 60000)
  }, [])

  async function getLiveOrders() {
    try {
      const params = {
        filter: {
          orgId: { eq: getCurrentUser()["custom:page_id"] },
          status: { ne: "GB" },
        },
      }
      await API.graphql(graphqlOperation(listOrderss, params)).then(res => {
        let empty = []
        setPortfolioOrders(empty)
        setPortfolioOrders(res.data.listOrderss.items)
        console.log(res.data.listOrderss.items)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getSubscribersQrs = async () => {
    try {
      const params = {
        id: getCurrentUser()["custom:page_id"],
      }
      await API.graphql(graphqlOperation(getSubscriber, params)).then(res => {
        let temp = seqQrs
        for (let i = 0; i < res.data.getSubscriber.seqQr; i++) {
          temp[i] = { key: i + 1 }
        }
        setSeqQrs(temp)
        setCustomQrs(res.data.getSubscriber.customQr)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const confirmOrder = (item, subitem) => {
    let temp = [...portfolioOrders]
    temp.forEach(itemElement => {
      if (itemElement === item) {
        itemElement.order.forEach(subitemElement => {
          if (subitemElement === subitem) {
            subitemElement.status = "CO"
          }
        })
      }
    })
    setPortfolioOrders(temp)
  }

  const cancelOrder = (item, subitem) => {
    let temp = [...portfolioOrders]
    temp.forEach(itemElement => {
      if (itemElement === item) {
        itemElement.order.forEach(subitemElement => {
          if (subitemElement === subitem) {
            subitemElement.status = "RC"
          }
        })
      }
    })
    setPortfolioOrders(temp)
  }

  const orderQueing = (id, subid, queueState) => {
    let temp = [...portfolioOrders]
    let o1 = temp.find(obj => obj.id === id)
    let o2 = o1.order.findIndex(obj => obj.id === subid)
    setPortfolioOrders(o1.order[o2].status = queueState)
    // temp.forEach((item, index) => {
    //   if (index === id) {
    //     item.order.forEach((subitem, subindex) => {
    //       if (subindex === subid) {
    //         subitem.status = queueState
    //         console.log(temp[id].order[subid])
    //       }
    //     })
    //   }
    // })

    // setPortfolioOrders(temp)
  }
  console.log(portfolioOrders)
  const generateBill = item => {
    let temp = [...portfolioOrders]
    temp.forEach(itemElement => {
      if (itemElement === item) {
        itemElement.status = "GB"
      }
    })
    setPortfolioOrders(temp)
  }

  const updateToCustomer = async item => {
    console.log(item.order)
    let params = {
      input: {
        id: item.id,
        order: item.order,
        status: item.status,
      },
    }

    try {
      await API.graphql(graphqlOperation(updateOrders, params)).then(res =>
        console.log(res)
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <h1 className={orderStyles.topic}>Live Orders</h1>
      <section className={orderStyles.ordersContainer}>
        {portfolioOrders.map((item, index) => (
          <section className={orderStyles.orderItemHolder} key={index}>
            <h1>
              Table {item.key}{" "}
              <label>
                <b>PIN:</b> {String(item.pin).substr(item.pin.length - 4)}
              </label>
            </h1>
            {item.status === "AB" && (
              <label style={{ fontSize: "0.8em", color: "green" }}>
                Customer has asked for the bill
              </label>
            )}
            <hr />
            <ul>
              {item.order.map((subitem, id) => (
                <li key={id}>
                  <section>
                    <label>
                      {subitem.name} x {subitem.qty}
                    </label>
                    <span>Rs. {subitem.price} /-</span>
                  </section>
                  <p>{subitem.request}</p>
                  <ul>
                    <li onClick={() => confirmOrder(item, subitem)}>
                      Confirm order
                      {subitem.status.includes("CO") && (
                        <ul>
                          <li
                            style={{
                              color:
                                subitem.status === "CO-OQ"
                                  ? "crimson"
                                  : "#169188",
                            }}
                            onClick={() => orderQueing(item.id, subitem.id, "CO-OQ")}
                          >
                            Order at queue
                          </li>
                          <li onClick={() => orderQueing(item.id, subitem.id, "CO-OK")}>
                            Order at kitchen
                          </li>
                          <li onClick={() => orderQueing(item.id, subitem.id, "CO-OS")}>
                            Order served
                          </li>
                        </ul>
                      )}
                    </li>
                    <li onClick={() => cancelOrder(item, subitem)}>
                      Request to cancel
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
            <label>Total - Rs. {item.totalPrice} /-</label>
            <button onClick={() => generateBill(item)}>Generate bill</button>
            <button onClick={() => updateToCustomer(item)}>
              Update to customer
            </button>
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

export const listOrderss = /* GraphQL */ `
  query ListOrderss($filter: ModelOrdersFilterInput) {
    listOrderss(filter: $filter) {
      items {
        id
        pin
        key
        orgId
        order {
          id
          name
          qty
          price
          request
          status
        }
        totalItems
        totalPrice
        status
      }
    }
  }
`

export const updateOrders = /* GraphQL */ `
  mutation UpdateOrders($input: UpdateOrdersInput!) {
    updateOrders(input: $input) {
      id
    }
  }
`
