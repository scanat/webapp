import React from "react"
import conversationStyles from "./conversation.module.css"

const Conversation = props => {
  console.log(props.content)
  return (
    <section className={conversationStyles.container}>
      {props.content.map(item => (
        <section
          className={conversationStyles.contentContainer}
          style={{ float: item.owner && "right" }}
        >
          <label className={conversationStyles.contentTopic}>Order Id</label>
          <p className={conversationStyles.contentData}>{item.input.id}</p>
          <label className={conversationStyles.contentTopic}>
            Order Placed ({item.input.totalItems})
          </label>
          {item.input.order.map(orderItem => (
            <section className={conversationStyles.contentItemContainer}>
              <p className={conversationStyles.contentData}>{orderItem.name}</p>
              <p className={conversationStyles.contentData}>
                Rs. {orderItem.price} /-
              </p>
              <p className={conversationStyles.contentData}>
                {orderItem.qty} units
              </p>
            </section>
          ))}
          <p className={conversationStyles.contentData}>{item.input.request}</p>
          <label className={conversationStyles.contentTopic}>Total Price</label>
          <p
            className={conversationStyles.contentData}
            style={{ color: "#169188" }}
          >
            Rs. {item.input.totalPrice} /-
          </p>
          <label className={conversationStyles.contentTopic}>
            Current Status
          </label>
          <p
            className={conversationStyles.contentData}
            style={{ color: "#169188" }}
          >
            {item.input.status}
          </p>
        </section>
      ))}
    </section>
  )
}

export default Conversation
