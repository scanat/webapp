import React, { useEffect, useState } from "react"
import axios from "axios"
import displayStyles from "./org-display.module.css"
import { navigate } from "gatsby"
import config from "../../config.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartPlus, faCaretUp } from "@fortawesome/free-solid-svg-icons"
import {
  faPlusSquare,
  faMinusSquare,
} from "@fortawesome/free-regular-svg-icons"
import Anime from "animejs"
import Layout from "../../components/layout"

const OrgDisplay = () => {
  const [list, setList] = useState([])
  const [orderList, setOrderList] = useState([])
  const [orgName, setOrgName] = useState("")
  const [confirmOrder, setConfirmOrder] = useState(false)
  const [orderListPulled, setOrderListPulled] = useState(false)

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    setOrgName(urlParams.get("org"))
    const pn = urlParams.get("pn")

    if (pn !== null && pn !== "") {
      var decodedPn = window.atob(pn)

      getAllData(decodedPn)
    } else {
      alert("Oops the link failed!")
      navigate("/")
    }
  }, [])

  useEffect(() => {
    Anime({
      targets: document.getElementById("orderListContainer"),
      height: ["40px", "200px"],
      duration: 1000,
      easing: "linear",
      autoplay: true,
      direction: orderListPulled ? "forwards" : "reverse",
    })
  }, [orderListPulled])

  const getAllData = async id => {
    try {
      const params = {
        phoneNumber: id,
      }
      const res = await axios.post(`${config.invokeUrl}/items/get`, params)
      res.data.item.map(dataItem => {
        if (dataItem.status) {
          dataItem.qty = 1
          dataItem.ordered = false
          list.push(dataItem)
        }
      })
      navigate(typeof window !== "undefined" && window.location.search)
    } catch (error) {
      console.log(error)
    }
  }

  const addItemToList = item => {
    item.ordered = true
    setOrderList(orderList.concat(item))
    console.log(orderList)
  }

  const removeItemFromList = id => {
    orderList.splice(id, 1)
    var tempList = [...list]
    tempList[id].ordered = false
    setList(tempList)
  }

  const incQty = id => {
    var tempList = [...list]
    tempList[id].qty += 1
    setList(tempList)
    // var tempOrderList = [...orderList]
    // tempOrderList[id].itemPrice *= tempOrderList[id].qty
    // setOrderList(tempOrderList)
  }

  const decQty = id => {
    var tempList = [...list]
    tempList[id].qty -= 1
    setList(tempList)
    // var tempOrderList = [...orderList]
    // tempOrderList[id].itemPrice *= tempOrderList[id].qty
    // setOrderList(tempOrderList)
  }

  const toggleConfirmOrder = () => {
    setConfirmOrder(!confirmOrder)
  }

  return (
    <Layout>
      <section className={displayStyles.container}>
        <h1 className={displayStyles.orgName}>{orgName}</h1>
        <section className={displayStyles.listContainer}>
          {list.map((item, index) => (
            <section className={displayStyles.greenCard} key={item._id}>
              <section className={displayStyles.textContainers}>
                <p className={displayStyles.itemName}>{item.itemName}</p>
                <p className={displayStyles.itemPrice}>
                  Rs {item.itemPrice} /-
                </p>
              </section>
              <section className={displayStyles.itemControls}>
                <FontAwesomeIcon
                  icon={faCartPlus}
                  onClick={() =>
                    !item.ordered
                      ? addItemToList(item)
                      : removeItemFromList(index)
                  }
                  size="lg"
                  color={!item.ordered ? "green" : "#db2626"}
                />
                <section>
                  <FontAwesomeIcon
                    icon={faMinusSquare}
                    onClick={() => item.qty > 1 && decQty(index)}
                    size="lg"
                    color="#db2626"
                  />
                  <label className={displayStyles.quantityText}>
                    {item.qty}
                  </label>
                  <FontAwesomeIcon
                    icon={faPlusSquare}
                    onClick={() => incQty(index)}
                    size="lg"
                    color="green"
                  />
                </section>
              </section>
            </section>
          ))}
        </section>

        {orderList.length > 0 && (
          <section
            id="orderListContainer"
            className={displayStyles.orderListContainer}
          >
            <section className={displayStyles.orderListTopShow}>
              <section
                className={displayStyles.orderListPuller}
                onClick={() => setOrderListPulled(!orderListPulled)}
              >
                <FontAwesomeIcon
                  icon={faCaretUp}
                  onClick={() => setOrderListPulled(!orderListPulled)}
                  size="lg"
                  color="#169188"
                />
              </section>
            </section>
            <br></br>
            {orderList.map((item, index) => (
              <section className={displayStyles.greenCard} key={item._id}>
                <section className={displayStyles.textContainers}>
                  <p className={displayStyles.itemName}>{item.itemName}</p>
                  <p className={displayStyles.itemPrice}>
                    Rs {item.itemPrice * item.qty} /-
                  </p>
                </section>
                <section className={displayStyles.OrderItemControls}>
                  <label className={displayStyles.orderedQuantity}>
                    Quantity : {item.qty}
                  </label>
                  <FontAwesomeIcon
                    icon={faCartPlus}
                    onClick={() =>
                      !item.ordered
                        ? addItemToList(item)
                        : removeItemFromList(index)
                    }
                    size="lg"
                    color={!item.ordered ? "green" : "#db2626"}
                  />
                </section>
              </section>
            ))}
            <section className={displayStyles.confirmSection}>
              <button
                type="button"
                className={displayStyles.confirmButton}
                onClick={toggleConfirmOrder}
              >
                Confirm Order
              </button>
            </section>
          </section>
        )}
      </section>
      {confirmOrder && (
        <ConfirmOrder
          orderList={orderList}
          switchConfirmOrder={toggleConfirmOrder}
        />
      )}
    </Layout>
  )
}

export default OrgDisplay

const ConfirmOrder = props => {
  const calculateTotal = () => {
    var total = 0
    props.orderList.forEach(item => {
      total += Number(item.itemPrice) * item.qty
    })
    return total
  }

  return (
    <section className={displayStyles.billContainer}>
      <secion className={displayStyles.billHolder}>
        <h4 className={displayStyles.confirmTopic}>
          Please confirm the order below
        </h4>
        {props.orderList.map(item => (
          <section className={displayStyles.orderItems}>
            <p className={displayStyles.orderItemName}>
              <b>{item.itemName}</b> <label className={displayStyles.qtyLabel}>x {item.qty}</label>
            </p>
            <p>{item.itemPrice * item.qty}/-</p>
          </section>
        ))}
        <section className={displayStyles.orderFinalItems}>
          <p>
            <b>Total</b>
          </p>
          <p>
            Rs. <b>{calculateTotal()}</b> /-
          </p>
        </section>

        <p className={displayStyles.infoText}>
          * All prices are inclusive of GST <br />
          <u>We will pass on your order with the reception</u>
        </p>
        <button type="button" className={displayStyles.requestButton} >
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
