import React, { useEffect, useRef, useState } from "react"
import furtherStyles from "./furtherDetails.module.css"
import Anime from "animejs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMinusSquare,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons"

const FurtherDetails = props => {
  const containerRef = useRef("")
  const [item, setItem] = useState({})

  useEffect(() => {
    Anime({
      targets: containerRef.current,
      opacity: [0, 1],
      duration: 800,
    })
    setItem(props.details)
  }, [])

  useEffect(() => {
    setItem(props.details)
  }, [props.details])

  const incQty = () => {
    props.details.qty += 1
    setItem(props.details)
    updateItemProp()
  }

  const decQty = () => {
    props.details.qty -= 1
    setItem(props.details)
    updateItemProp()
  }

  const updateItemProp = () => {
    props.updateItem()
  }

  const updateItemOrderProp = () => {
    props.updateItemOrder(props.details)
  }

  const addItemToList = () => {
    props.details.ordered = true
    setItem(props.details)
    updateItemOrderProp()
  }

  const removeItemFromList = () => {
    props.details.ordered = false
    setItem(props.details)
    updateItemOrderProp()
  }

  return (
    <section ref={containerRef} className={furtherStyles.container}>
      <section className={furtherStyles.itemImageContainer}>
        <img src={item && item.imageData} className={furtherStyles.itemImage} />
        <section className={furtherStyles.flexedStyle}>
          <label className={furtherStyles.itemName}>{item.itemName}</label>
          <label className={furtherStyles.itemPrice}>{item.itemPrice} /-</label>
        </section>
        <section className={furtherStyles.itemControls}>
          <label
            style={{ color: !item.ordered ? "steelblue" : "crimson" }}
            onClick={!item.ordered ? addItemToList : removeItemFromList}
          >
            <u>{!item.ordered ? "Add to Cart" : "Remove from Cart"}</u>
          </label>
          <section>
            <FontAwesomeIcon
              icon={faMinusSquare}
              onClick={item.qty > 1 ? decQty : null}
              size="lg"
              color="#db2626"
            />
            <label className={furtherStyles.quantityText}>{item.qty}</label>
            <FontAwesomeIcon
              icon={faPlusSquare}
              onClick={incQty}
              size="lg"
              color="green"
            />
          </section>
        </section>
      </section>
    </section>
  )
}

export default FurtherDetails
