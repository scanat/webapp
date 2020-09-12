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

const OrgDisplay = () => {
  const [list, setList] = useState([])
  const [orderList, setOrderList] = useState([])
  const [orgName, setOrgName] = useState("")
  const [quantity, setQuantity] = useState(1)
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
      setList(res.data.item)
    } catch (error) {
      console.log(error)
    }
  }

  const addItemToList = item => {
    item.status = false
    setOrderList(orderList.concat(item))
  }

  console.log(orderList)

  const removeItemFromList = item => {
    alert(item.itemName)
  }

  return (
    <section className={displayStyles.container}>
      <h1 className={displayStyles.orgName}>{orgName}</h1>
      <section className={displayStyles.listContainer}>
        {list.map(item => (
          <section className={displayStyles.greenCard} key={item._id}>
            <section className={displayStyles.textContainers}>
              <p className={displayStyles.itemName}>{item.itemName}</p>
              <p className={displayStyles.itemPrice}>Rs {item.itemPrice} /-</p>
            </section>
            <section className={displayStyles.itemControls}>
              <FontAwesomeIcon
                icon={faCartPlus}
                onClick={() =>
                  item.status ? addItemToList(item) : removeItemFromList(item)
                }
                size="lg"
                color={item.status ? "green" : "#db2626"}
              />
              <section>
                <FontAwesomeIcon
                  icon={faMinusSquare}
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  size="lg"
                  color="#db2626"
                />
                <label className={displayStyles.quantityText}>{quantity}</label>
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  onClick={() => setQuantity(quantity + 1)}
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
          {orderList.map(item => (
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
                    item.status ? addItemToList(item) : removeItemFromList(item)
                  }
                  size="lg"
                  color={item.status ? "green" : "#db2626"}
                />
                <section>
                  <FontAwesomeIcon
                    icon={faMinusSquare}
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    size="lg"
                    color="#db2626"
                  />
                  <label className={displayStyles.quantityText}>
                    {quantity}
                  </label>
                  <FontAwesomeIcon
                    icon={faPlusSquare}
                    onClick={() => setQuantity(quantity + 1)}
                    size="lg"
                    color="green"
                  />
                </section>
              </section>
            </section>
          ))}
        </section>
      )}
    </section>
  )
}

export default OrgDisplay
