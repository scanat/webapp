import React, { useState, useEffect, useRef } from "react"
import defaultStyles from "./default.module.css"
import AWS from "aws-sdk"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import Anime from "animejs"
import ConfirmOrder from "./confirmOrder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCaretDown,
  faCaretUp,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons"
import { faMinusSquare, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { navigate } from "gatsby"

const subscriberItemsS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const Default = props => {
  const orderListContainer = useRef("")
  const [orderListPulled, setOrderListPulled] = useState(false)
  const [list, setList] = useState([])
  const [orderList, setOrderList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [confirmOrder, setConfirmOrder] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categoryList, setCategoryList] = useState(["All"])
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    getData()
  }, [])
  async function getData() {
    try {
      await API.graphql(
        graphqlOperation(itemsData, {
          id: String(props.location.search).substring(4),
        })
      ).then(res => {
        setOrgName(res.data.getSubscriber.orgName)
        res.data.getItems.itemList.map(dataItem => {
          if (dataItem.status) {
            dataItem.qty = 1
            dataItem.ordered = false
            list.push(dataItem)
            let temp = [...list]
            setList(temp)
            if (!categoryList.includes(dataItem.category))
              categoryList.push(dataItem.category)
            let tempCat = [...categoryList]
            setCategoryList(tempCat)
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    API.graphql(graphqlOperation(onUpdateItems)).subscribe({
      next: data => {
        if (
          String(props.location.search).substring(4) ===
          data.value.data.onUpdateItems.id
        ) {
          list.splice(0, list.length)
          let temp = [...list]
          setList(temp)
          getData()
        }
      },
      error: err => {
        console.log(err)
      },
    })
  }, [])

  useEffect(() => {
    Anime({
      targets: orderListContainer.current,
      height: ["20px", "400px"],
      duration: 500,
      easing: "linear",
      autoplay: true,
      direction: orderListPulled ? "forwards" : "reverse",
    })
  }, [orderListPulled])

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
  }

  const decQty = (givenList, id) => {
    var tempList = [...givenList]
    tempList[id].qty -= 1
    givenList === list ? setList(tempList) : setFilteredList(tempList)
  }

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
    <>
      <section className={defaultStyles.container}>
        <h1 className={defaultStyles.orgName}>{orgName}</h1>

        <section className={defaultStyles.menuNav}>
          <ul>
            {categoryList.map(item => (
              <li onClick={() => filterCategoricalList(item)}>
                {item === "Category" ? "All" : item}
              </li>
            ))}
          </ul>
        </section>
        <section className={defaultStyles.listContainer}>
          <h1 className={defaultStyles.categoryTopic}>{selectedCategory}</h1>
          {selectedCategory !== "All" &&
            filteredList.map((item, index) => (
              <section className={defaultStyles.greenCard} key={item._id}>
                <section className={defaultStyles.textContainers}>
                  <p className={defaultStyles.itemName}>{item.itemName}</p>
                  <p className={defaultStyles.itemPrice}>
                    Rs {item.itemPrice} /-
                  </p>
                </section>
                <section className={defaultStyles.itemControls}>
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
                    <label className={defaultStyles.quantityText}>
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
              <section className={defaultStyles.greenCard} key={item._id}>
                <section className={defaultStyles.textContainers}>
                  <p className={defaultStyles.itemName}>{item.itemName}</p>
                  <p className={defaultStyles.itemPrice}>
                    Rs {item.itemPrice} /-
                  </p>
                </section>
                <section className={defaultStyles.itemControls}>
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
                    <label className={defaultStyles.quantityText}>
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
            ref={orderListContainer}
            className={defaultStyles.orderListContainer}
          >
            <section className={defaultStyles.orderListTopShow}>
              <section
                className={defaultStyles.orderListPuller}
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
              <section className={defaultStyles.greenCard} key={item._id}>
                <section className={defaultStyles.textContainers}>
                  <p className={defaultStyles.itemName}>{item.itemName}</p>
                  <p className={defaultStyles.itemPrice}>
                    Rs {item.itemPrice * item.qty} /-
                  </p>
                </section>
                <section className={defaultStyles.OrderItemControls}>
                  <label className={defaultStyles.orderedQuantity}>
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
            <section className={defaultStyles.confirmSection}>
              <button
                type="button"
                className={defaultStyles.confirmButton}
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
          //   qrId={qrId}
          //   subscriberPhoneNumber={subscriberPhoneNumber}
          switchConfirmOrder={toggleConfirmOrder}
        />
      )}
    </>
  )
}

export default Default

export const itemsData = /* GraphQL */ `
  query GetItems($id: ID!) {
    getItems(id: $id) {
      itemList {
        id
        category
        image
        itemName
        itemPrice
        status
      }
    }
    getSubscriber(id: $id) {
      orgName
    }
  }
`

export const onUpdateItems = /* GraphQL */ `
  subscription OnUpdateItems {
    onUpdateItems {
      id
    }
  }
`
