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
  faCommentDots,
  faInfoCircle,
  faMinusSquare,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons"
import FurtherDetails from "./furtherDetails"
import Conversation from "./conversation"

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
  const [openInfo, setOpenInfo] = useState(null)
  const [conversation, setConversation] = useState([])
  const [openConversation, setOpenConversation] = useState(false)

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
          console.log(data)
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
  }

  const removeItemFromList = sentitem => {
    var tempList = [...orderList]
    tempList.map((item, index) => {
      if (item.id === sentitem.id) {
        tempList.splice(index, 1)
        item.ordered = false
        setOrderList(tempList)
      }
    })
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

  const updateItem = () => {
    let temp = [...list]
    setList(temp)
  }

  const updateItemOrder = sentitem => {
    sentitem.ordered === false
      ? removeItemFromList(sentitem)
      : addItemToList(sentitem)
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

  const openItemInfo = async item => {
    if (item.image) {
      try {
        const params = {
          Bucket: process.env.GATSBY_S3_BUCKET,
          Key: `public/${item.image}`,
        }
        await subscriberItemsS3.getObject(params, (err, res) => {
          let temp = [...list]
          temp.map(itemData => {
            if (itemData.id === item.id) {
              itemData.imageData = res.Body
              setList(temp)
              setOpenInfo(itemData)
            }
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
    setOpenInfo(item)
  }

  const getConfData = data => {
    conversation.push(data)
    let temp = [...conversation]
    setConversation(temp)
    setConfirmOrder(false)
    setOpenConversation(true)
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
              <section className={defaultStyles.greenCard} key={item.id}>
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
                        : removeItemFromList(item)
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
                  <FontAwesomeIcon
                    onClick={
                      item.imageData
                        ? () => setOpenInfo(item)
                        : () => openItemInfo(item)
                    }
                    icon={faInfoCircle}
                    size="lg"
                    color="grey"
                  />
                </section>
              </section>
            ))}
          {selectedCategory === "All" &&
            list.map((item, index) => (
              <section className={defaultStyles.greenCard} key={item.id}>
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
                        : removeItemFromList(item)
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
                  <FontAwesomeIcon
                    onClick={
                      item.imageData
                        ? () => setOpenInfo(item)
                        : () => openItemInfo(item)
                    }
                    icon={faInfoCircle}
                    size="lg"
                    color="grey"
                  />
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
            <h1 className={defaultStyles.orgName}>Your Orders</h1>
            {orderList.map((item, index) => {
              if (item.ordered) {
                return (
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
                            : removeItemFromList(item)
                        }
                        size="lg"
                        color={!item.ordered ? "green" : "#db2626"}
                      />
                    </section>
                  </section>
                )
              }
            })}
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
          id={String(props.location.search).substring(4)}
          getConfData={data => getConfData(data)}
          switchConfirmOrder={toggleConfirmOrder}
        />
      )}
      {openInfo !== null && (
        <section className={defaultStyles.furtherDetailsContainer}>
          <FurtherDetails
            details={openInfo}
            updateItem={updateItem}
            updateItemOrder={item => updateItemOrder(item)}
          />
          <section
            onClick={() => setOpenInfo(null)}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          ></section>
        </section>
      )}
      {openConversation && <Conversation content={conversation} />}
      {conversation.length > 0 && (
        <FontAwesomeIcon
          icon={faCommentDots}
          onClick={() => setOpenConversation(!openConversation)}
          size="2x"
          color="#169188"
          style={{ position: "fixed", bottom: 30, right: "5%", zIndex: 7 }}
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
