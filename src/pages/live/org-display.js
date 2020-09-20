import React, { useEffect, useState } from "react"
import axios from "axios"
import displayStyles from "./org-display.module.css"
import { navigate } from "gatsby"
import config from "../../config.json"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCartPlus,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons"
import {
  faPlusSquare,
  faMinusSquare,
} from "@fortawesome/free-regular-svg-icons"
import Anime from "animejs"
import Layout from "../../components/layout"
import { getCurrentUser } from "../../utils/auth"

const OrgDisplay = () => {
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [categoryList, setCategoryList] = useState(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [orderList, setOrderList] = useState([])
  const [orgName, setOrgName] = useState("")
  const [subscriberPhoneNumber, setSubscriberPhoneNumber] = useState("")
  const [qrId, setQrId] = useState("")
  const [confirmOrder, setConfirmOrder] = useState(false)
  const [orderListPulled, setOrderListPulled] = useState(false)

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    setOrgName(urlParams.get("org"))
    const pn = urlParams.get("pn")
    const id = urlParams.get("id")

    setQrId(id)

    if (pn.length > 0) {
      var decodedPn = window.atob(pn)

      setSubscriberPhoneNumber(decodedPn)
      getAllData(decodedPn)
    } else {
      alert("Oops the link failed!")
      navigate("/")
    }
  }, [])

  useEffect(() => {
    Anime({
      targets: document.getElementById("orderListContainer"),
      height: ["20px", "400px"],
      duration: 500,
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

      // setCategoryList(res.data.data.categories)

      res.data.data.data.map(dataItem => {
        if (dataItem.status) {
          dataItem.qty = 1
          dataItem.ordered = false
          list.push(dataItem)

          if (!categoryList.includes(dataItem.category))
            categoryList.push(dataItem.category)
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

  const incQty = (givenList, id) => {
    var tempList = [...givenList]
    tempList[id].qty += 1
    givenList === list ? setList(tempList) : setFilteredList(tempList)
    // var tempOrderList = [...orderList]
    // tempOrderList[id].itemPrice *= tempOrderList[id].qty
    // setOrderList(tempOrderList)
  }

  const decQty = (givenList, id) => {
    var tempList = [...givenList]
    tempList[id].qty -= 1
    givenList === list ? setList(tempList) : setFilteredList(tempList)
    // var tempOrderList = [...orderList]
    // tempOrderList[id].itemPrice *= tempOrderList[id].qty
    // setOrderList(tempOrderList)
  }

  // Clear Filtered List wrt item
  const clearFilteredList = item => {
    var tempList = [...filteredList]
    filteredList.map(itemData => {
      if (itemData.category === item) {
        tempList.pop(itemData)
      }
    })
    setFilteredList(tempList)
    setFilteredList(null)
    console.log(filteredList)
  }

  // Filtered Categorical List formation
  const filterCategoricalList = item => {
    if (item === "Category") {
      setSelectedCategory("All")
    } else {
      setSelectedCategory(item)
      var tempList = []
      list.map(itemData => {
        if (itemData.category === item) {
          tempList.push(itemData)
        }
      })
      setFilteredList(tempList)
    }
  }

  const toggleConfirmOrder = () => {
    setConfirmOrder(!confirmOrder)
  }

  return (
    <Layout>
      <section className={displayStyles.container}>
        <h1 className={displayStyles.orgName}>{orgName}</h1>

        <section className={displayStyles.menuNav}>
          <ul>
            {categoryList.map(item => (
              <li onClick={() => filterCategoricalList(item)}>
                {item === "Category" ? "All" : item}
              </li>
            ))}
          </ul>
        </section>
        <section className={displayStyles.listContainer}>
          <h1 className={displayStyles.categoryTopic}>{selectedCategory}</h1>
          {selectedCategory !== "All" &&
            filteredList.map((item, index) => (
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
                      onClick={() =>
                        item.qty > 1 && decQty(filteredList, index)
                      }
                      size="lg"
                      color="#db2626"
                    />
                    <label className={displayStyles.quantityText}>
                      {item.qty}
                    </label>
                    <FontAwesomeIcon
                      icon={faPlusSquare}
                      onClick={() => incQty(filteredList, index)}
                      size="lg"
                      color="green"
                    />
                  </section>
                </section>
              </section>
            ))}
          {selectedCategory === "All" &&
            list.map((item, index) => (
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
                      onClick={() => item.qty > 1 && decQty(list, index)}
                      size="lg"
                      color="#db2626"
                    />
                    <label className={displayStyles.quantityText}>
                      {item.qty}
                    </label>
                    <FontAwesomeIcon
                      icon={faPlusSquare}
                      onClick={() => incQty(list, index)}
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
                  icon={orderListPulled ? faCaretDown : faCaretUp}
                  onClick={() => setOrderListPulled(!orderListPulled)}
                  size="lg"
                  color="white"
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
          qrId={qrId}
          subscriberPhoneNumber={subscriberPhoneNumber}
          switchConfirmOrder={toggleConfirmOrder}
        />
      )}
    </Layout>
  )
}

export default OrgDisplay

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
    try {
      const params = {
        subscriberPhoneNumber: props.subscriberPhoneNumber,
        userPhoneNumber: getCurrentUser().phone_number,
        data: props.orderList,
        qrId: props.qrId + "",
        reqMessage: message,
      }
      const res = await axios.post(`${config.userDataAPI}/orders/add`, params)

      sendOrderCopy(res.data.orderId)
      // props.switchConfirmOrder
    } catch (error) {
      console.log(error)
    }
  }

  const sendOrderCopy = async orderId => {
    try {
      const params = {
        phoneNumber: "+91" + props.subscriberPhoneNumber,
        orderId: orderId,
      }
      const res = await axios.post(
        `${config.userDataAPI}/orders/addcopy`,
        params
      )
      console.log(res)

      // props.switchConfirmOrder
    } catch (error) {
      console.log(error)
    }
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
              <b>{item.itemName}</b>{" "}
              <label className={displayStyles.qtyLabel}>x {item.qty}</label>
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

        <section>
          <input
            type="textarea"
            placeholder="Any special requests..."
            className={displayStyles.message}
            onChange={e => setMessage(e.target.value)}
          />
        </section>

        <p className={displayStyles.infoText}>
          * All prices are exclusive of GST <br />
          <u>We will pass on your order with the reception</u>
        </p>
        <button
          type="button"
          className={displayStyles.requestButton}
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
