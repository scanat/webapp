import React, { useState } from "react"
import confirmOrderStyles from "./confirmOrder.module.css"

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
      // const params = {
      //   subscriberPhoneNumber: props.subscriberPhoneNumber,
      //   userPhoneNumber: getCurrentUser().phone_number,
      //   data: props.orderList,
      //   qrId: props.qrId + "",
      //   reqMessage: message,
      // }
      // const res = await axios.post(`${config.userDataAPI}/orders/add`, params)

      // sendOrderCopy(res.data.orderId)
      // props.switchConfirmOrder
    } catch (error) {
      console.log(error)
    }
  }

  const sendOrderCopy = async orderId => {
    try {
      // const params = {
      //   phoneNumber: "+91" + props.subscriberPhoneNumber,
      //   orderId: orderId,
      // }
      // const res = await axios.post(
      //   `${config.userDataAPI}/orders/addcopy`,
      //   params
      // )
      // console.log(res)

      // props.switchConfirmOrder
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
              <label className={confirmOrderStyles.qtyLabel}>x {item.qty}</label>
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
