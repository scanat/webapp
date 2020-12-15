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
        // res.data.listOrderss.items.forEach((item, id) => {
        //   if (!String(item.key).length > 0) {
        //     let temp = []
        //     temp.push(item)
        //     setPortfolioOrders(temp)
        //     console.log(temp)
        //   }
        // })
        // let tempSeq = seqQrs
        // tempSeq.forEach((item, id) => {
        //   res.data.listOrderss.items.forEach(checkItem => {
        //     if (item.key == checkItem.key) {
        //       tempSeq[id] = checkItem
        //     }
        //   })
        // })
        // setSeqQrs(tempSeq)
        // let tempCustom = customQrs
        // tempCustom.forEach((item, id) => {
        //   res.data.listOrderss.items.forEach(checkItem => {
        //     if (item.key == checkItem.key) {
        //       tempCustom[id] = checkItem
        //     }
        //   })
        // })
        // setCustomQrs(tempCustom)
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
    temp.forEach((item, index) => {
      if(index === id){
        Array(item.order).forEach((subitem, subindex) => {
          if(subindex === subid){
            subitem.status = queueState
            setPortfolioOrders(temp)
            console.log(temp[id].order[subid])
          }
        })
      }
    })
  }

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
            <h1>Table {item.key}</h1>
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
                            onClick={() => orderQueing(index, id, "CO-OQ")}
                          >
                            Order at queue
                          </li>
                          <li onClick={() => orderQueing(index, id, "CO-OK")}>
                            Order at kitchen
                          </li>
                          <li onClick={() => orderQueing(index, id, "CO-OS")}>
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
      {/* <section className={orderStyles.portfolioOrders}>
        <h1 style={{ position: "relative" }}>
          Portfolio Orders
          {portfolioOrders.length > 0 && (
            <FontAwesomeIcon
              icon={faCircle}
              color="crimson"
              size="xs"
              style={{ position: "absolute", top: -10, right: -10, width: 8 }}
            />
          )}
        </h1>
      </section>
      <section className={orderStyles.gridContainer}>
        {seqQrs.map((item, id) => (
          <section
            className={orderStyles.orderGrid}
            key={id}
            style={{
              background: item.status === "Requested Confirmation" && "#169188",
            }}
          >
            <h1
              style={{
                color: item.status === "Requested Confirmation" && "whitesmoke",
              }}
            >
              {id + 1}
            </h1>
            <label
              style={{
                fontSize: "0.7em",
                color:
                  item.status === "Requested Confirmation"
                    ? "whitesmoke"
                    : "#169188",
              }}
            >
              Restaurant
            </label>
          </section>
        ))}
        {customQrs.map((item, id) => (
          <section
            className={orderStyles.orderGrid}
            key={id}
            style={{
              background: item.status === "Requested Confirmation" && "#169188",
            }}
          >
            <h1
              style={{
                color: item.status === "Requested Confirmation" && "whitesmoke",
              }}
            >
              {item.key ? item.key : item}
            </h1>
            <label
              style={{
                fontSize: "0.7em",
                color:
                  item.status === "Requested Confirmation"
                    ? "whitesmoke"
                    : "#169188",
              }}
            >
              Hotel
            </label>
          </section>
        ))}
      </section> */}
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
        key
        orgId
        order {
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
