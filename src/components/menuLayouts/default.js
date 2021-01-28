import defaultStyles from "./default.module.css"
import Anime from "animejs"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import AWS from "aws-sdk"
import Carousel from "react-elastic-carousel"
import React, { useState, useEffect, useRef } from "react"
// import ConfirmOrder from "./confirmOrder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleLeft,
  faSearch,
  faTimesCircle,
  faAngleDoubleLeft,
  faAngleRight,
  faUserAlt,
  faRupeeSign,
  faPenFancy,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons"
import { faClock } from "@fortawesome/free-regular-svg-icons"
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
  const [filterOpen, setFilterOpen] = useState(false)
  const [filteredList, setFilteredList] = useState([])
  const [itemSearch, setItemSearch] = useState("")
  const [searchList, setSearchList] = useState([])
  const [confirmOrder, setConfirmOrder] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categoryList, setCategoryList] = useState(["All"])
  const [orgName, setOrgName] = useState("")
  const [openInfo, setOpenInfo] = useState(null)
  const [conversation, setConversation] = useState([])
  const [openConversation, setOpenConversation] = useState(false)
  const filterPanelRef = useRef(null)
  const orderListPanel = useRef(null)
  const [openOrderListPanel, setOpenOrderListPanel] = useState(false)
  const liveMenuRef = useRef(null)
  const suggestionRef = useRef(null)
  const [finalList, setFinalList] = useState([])
  const [ordered, setOrdered] = useState({ orderId: null, placed: false })
  const [openPinPanel, setOpenPinPanel] = useState(false)

  useEffect(() => {
    liveMenuRef.current.style.display = "block"
    filterCategoricalList(props.category)
  }, [props.category])

  useEffect(() => {
    liveMenuRef.current.style.display = "none"
    getData()
  }, [])

  async function getData() {
    try {
      let params = {
        id: props.id,
      }
      await API.graphql(graphqlOperation(itemsData, params)).then(res => {
        if (res) {
          setOrgName(res.data.getSubscriber.orgName)
          res.data.getItems.itemList.map(dataItem => {
            if (dataItem.status) {
              dataItem.qty = 1
              // dataItem.ordered = false
              dataItem.status = ""
              list.push(dataItem)
              let temp = [...list]
              setList(temp)
              if (!categoryList.includes(dataItem.category))
                categoryList.push(dataItem.category)
              let tempCat = [...categoryList]
              setCategoryList(tempCat)
            }
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

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
    // item.ordered = true
    item.status = "O"
    item.request = ""
    let temp = [...orderList]
    temp.push(item)
    setOrderList(temp)
  }

  const removeItemFromList = sentitem => {
    var tempList = [...orderList]
    tempList.map((item, index) => {
      if (item.id === sentitem.id) {
        tempList.splice(index, 1)
        // item.ordered = false
        item.status = ""
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
    if (tempList[id].qty > 1) {
      tempList[id].qty -= 1
      givenList === list ? setList(tempList) : setFilteredList(tempList)
    }
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

  useEffect(() => {
    filterOpen
      ? Anime({
          targets: filterPanelRef.current,
          opacity: [0, 1],
          duration: 400,
          begin: () => {
            filterPanelRef.current.style.display = "block"
          },
        }).play()
      : Anime({
          targets: filterPanelRef.current,
          opacity: [1, 0],
          duration: 400,
          complete: () => {
            filterPanelRef.current.style.display = "none"
          },
        }).play()
  }, [filterOpen])

  useEffect(() => {
    if (itemSearch !== "") {
      var tempList = []
      list.map(item => {
        String(item.itemName)
          .toLowerCase()
          .includes(String(itemSearch).toLowerCase()) && tempList.push(item)
      })
      setSearchList(tempList)
      console.log(searchList)
    } else {
      let emptyList = []
      setSearchList(emptyList)
    }
  }, [itemSearch])

  useEffect(() => {}, [])

  useEffect(() => {
    var calc = window.screen.height - 44
    openOrderListPanel
      ? Anime({
          targets: orderListPanel.current,
          bottom: [`${calc}px`, 0],
          easing: "linear",
          duration: 200,
        })
      : Anime({
          targets: orderListPanel.current,
          bottom: [0, `${calc}px`],
          easing: "linear",
          duration: 200,
        })
  }, [openOrderListPanel])

  const placeOrder = async pin => {
    setOpenPinPanel(true)
    let temp = [...orderList]
    let tempList = [...finalList]

    temp.map(item => {
      tempList.push({
        id: item.id,
        name: item.itemName,
        price: item.itemPrice,
        qty: item.qty,
        request: item.request,
        status: "SC",
      })
    })

    let totalPrice = 0
    tempList.forEach(element => {
      totalPrice = totalPrice + parseFloat(element.price)
    })

    try {
      const input = {
        pin: props.id + pin,
        key: props.key,
        orgId: props.id,
        order: tempList,
        totalItems: tempList.length,
        totalPrice: totalPrice,
        status: "SC",
      }

      await API.graphql(graphqlOperation(createOrders, { input: input })).then(
        res => {
          setOrdered({ orderId: res.data.createOrders.id, placed: true })
          setOpenPinPanel(false)
          setFinalList(tempList)
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const askForBill = async () => {
    const input = {
      id: ordered.orderId,
      status: "AB",
    }
    try {
      await API.graphql(graphqlOperation(updateOrders, { input: input })).then(
        res => {
          console.log(res.data)
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setInterval(() => getOrderUpdates(), 30000)
    async function getOrderUpdates() {
      if (ordered.orderId) {
        let params = {
          id: ordered.orderId,
        }
        await API.graphql(graphqlOperation(getOrders, params)).then(res => {
          if (res.data.getOrders) {
            res.data.getOrders.status === "GB" &&
              navigate(`/bill/?id=${ordered.orderId}`)
            setFinalList(res.data.getOrders.order)
          }
        })
      }
    }
  }, [ordered])
  console.log(orderList)
  console.log(finalList)
  const cancelOrder = () => {}

  return (
    <section ref={liveMenuRef} className={defaultStyles.liveMenuContainer}>
      <section className={defaultStyles.liveMenuSearchPanel}>
        <h1>{selectedCategory}</h1>
        <label
          className={defaultStyles.liveMenuFilter}
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Menu
        </label>

        <input
          type="text"
          placeholder="Search"
          onChange={e => setItemSearch(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faSearch}
          style={{ position: "absolute", left: 0, top: "37px" }}
          color="grey"
          size="sm"
        />
      </section>
      <section ref={filterPanelRef} className={defaultStyles.filterPanel}>
        <FontAwesomeIcon
          icon={faTimesCircle}
          style={{ position: "absolute", right: "-10px", top: "-10px" }}
          size="lg"
          onClick={() => setFilterOpen(false)}
        />
        {categoryList.map((item, index) => (
          <section
            key={index}
            onClick={() => {
              filterCategoricalList(item)
              setFilterOpen(false)
            }}
          >
            <label>{item}</label>
          </section>
        ))}
      </section>

      <section className={defaultStyles.container}>
        <section className={defaultStyles.itemsContainer}>
          {searchList.length !== 0 &&
            searchList.map((item, index) => (
              <section className={defaultStyles.item} key={index}>
                <img
                  src={require("../../images/icon/" +
                    item.category.toLowerCase() +
                    ".svg")}
                  title={index}
                />
                <label className={defaultStyles.itemName}>
                  {item.itemName}
                </label>
                <p className={defaultStyles.itemDescription}>{item.desc}</p>
                <label className={defaultStyles.itemPrice}>
                  {item.itemPrice}
                </label>
                <section
                  className={defaultStyles.itemOrderToggle}
                  style={{
                    justifyContent: item.status === "" ? "right" : "left",
                    background: item.status === "" ? "grey" : "green",
                  }}
                  onClick={() =>
                    item.status === ""
                      ? addItemToList(item)
                      : removeItemFromList(item)
                  }
                >
                  {item.status === "" ? "+" : "-"}
                </section>
              </section>
            ))}
          {searchList.length === 0 && selectedCategory === "All"
            ? list.map((item, index) => (
                <section className={defaultStyles.item} key={index}>
                  <img
                    src={require("../../images/icon/" +
                      item.category.toLowerCase() +
                      ".svg")}
                    title={index}
                  />
                  <label className={defaultStyles.itemName}>
                    {item.itemName}
                  </label>
                  <p className={defaultStyles.itemDescription}>{item.desc}</p>
                  <label className={defaultStyles.itemPrice}>
                    {item.itemPrice}
                  </label>
                  <section
                    className={defaultStyles.itemOrderToggle}
                    style={{
                      justifyContent: item.status === "" ? "right" : "left",
                      background: item.status === "" ? "grey" : "green",
                    }}
                    onClick={() =>
                      item.status === ""
                        ? addItemToList(item)
                        : removeItemFromList(item)
                    }
                  >
                    {item.status === "" ? "+" : "-"}
                  </section>
                </section>
              ))
            : filteredList.map((item, index) => (
                <section className={defaultStyles.item} key={index}>
                  <img
                    src={require("../../images/icon/" +
                      item.category.toLowerCase() +
                      ".svg")}
                    title={index}
                  />
                  <label className={defaultStyles.itemName}>
                    {item.itemName}
                  </label>
                  <p className={defaultStyles.itemDescription}>{item.desc}</p>
                  <label className={defaultStyles.itemPrice}>
                    {item.itemPrice}
                  </label>
                  <section
                    className={defaultStyles.itemOrderToggle}
                    style={{
                      justifyContent: item.status === "" ? "right" : "left",
                      background: item.status === "" ? "grey" : "green",
                    }}
                    onClick={() =>
                      item.status === ""
                        ? addItemToList(item)
                        : removeItemFromList(item)
                    }
                  >
                    {item.status === "" ? "+" : "-"}
                  </section>
                </section>
              ))}
        </section>
        {orderList.length > 0 && (
          <section
            className={defaultStyles.orderListBottomPanel}
            onClick={() => setOrderListPulled(!orderListPulled)}
          >
            <label>
              {orderList.length} {orderList.length > 1 ? "items" : "item"}{" "}
              selected
            </label>
            <button onClick={() => setOpenOrderListPanel(!openOrderListPanel)}>
              Add to table
            </button>
          </section>
        )}

        <section
          ref={orderListPanel}
          className={defaultStyles.orderListPanelContainer}
        >
          <section className={defaultStyles.orderListPanelTopControls}>
            <label onClick={() => setOpenOrderListPanel(false)}>
              <FontAwesomeIcon
                icon={faAngleDoubleLeft}
                size="lg"
                color="white"
                style={{ marginLeft: "10px" }}
              />
            </label>
            <section>
              {ordered.placed && (
                <span
                  className={defaultStyles.roundedButton}
                  onClick={askForBill}
                >
                  Ask for bill
                </span>
              )}
              <span
                className={defaultStyles.roundedButton}
                onClick={() => setOpenOrderListPanel(false)}
              >
                + Add
              </span>
              <span>
                Your table<span>{props.table}</span>
              </span>
            </section>
          </section>

          <Carousel
            itemsToShow={1}
            pagination={false}
            renderArrow={({ type, onClick }) => (
              <FontAwesomeIcon
                onClick={onClick}
                icon={type === "PREV" ? faAngleLeft : faAngleRight}
                size="2x"
                color="white"
                style={{ margin: "30vh 5px 0 5px" }}
              />
            )}
          >
            {orderList.map((item, index) => (
              <section key={index} className={defaultStyles.orderListPanelItem}>
                <img
                  src={require("../../images/icon/" +
                    item.category.toLowerCase() +
                    ".svg")}
                />
                <section>
                  <section>
                    <span onClick={() => incQty(orderList, index)}>+</span>
                    <label>{item.qty}</label>
                    <span onClick={() => decQty(orderList, index)}>-</span>
                  </section>
                  {finalList.length > 0 &&
                    finalList[index] &&
                    finalList[index].status === "CO" && (
                      <label
                        style={{
                          lineHeight: "30px",
                          color: "green",
                          fontSize: "0.8em",
                        }}
                      >
                        Your ordered item is confirmed
                      </label>
                    )}
                  <h4>{item.itemName}</h4>
                  <section>
                    <span>
                      <FontAwesomeIcon icon={faClock} color="grey" size="lg" />
                      <span>
                        <b>20</b>min
                      </span>
                    </span>
                    <span>Veg</span>
                    <span>
                      <FontAwesomeIcon
                        icon={faUserAlt}
                        color="grey"
                        size="lg"
                      />
                      <span>
                        <b>1</b>serving
                      </span>
                    </span>
                  </section>
                  <span>
                    <FontAwesomeIcon icon={faRupeeSign} size="sm" />
                    {item.itemPrice
                      ? item.itemPrice * item.qty
                      : item.price * item.qty}
                  </span>
                  <hr
                    style={{
                      width: "100%",
                      height: 0,
                      border: "none",
                      borderBottom: "grey 2px solid",
                      borderRadius: 0,
                    }}
                  />
                  <p>
                    {item.description}Tomato, Capsicum, Cheese, Cabbage, Perfect
                    Salt
                  </p>
                  <section>
                    <FontAwesomeIcon icon={faPenFancy} size="lg" color="grey" />
                    <input
                      maxLength={100}
                      placeholder={
                        item.request ? item.request : "Add your suggestions"
                      }
                      onChange={e => {
                        item.request = e.target.value
                      }}
                    />
                  </section>
                </section>
              </section>
            ))}
          </Carousel>
          <button onClick={() => setOpenPinPanel(true)}>
            Send for cooking
          </button>
        </section>
        {openPinPanel && (
          <section className={defaultStyles.pinPanelContainer}>
            <section>
              <label>Order pin</label>
              <input
                type="tel"
                maxLength={4}
                autoFocus
                onChange={e =>
                  e.target.value.length === 4 && placeOrder(e.target.value)
                }
              />
              <section>
                <input type="checkbox" name="pinExists" value="Pin Exists" />
                <label for="pinExists">Already have a pin!</label>
              </section>
              <p>Use order pin to track and update your order</p>
            </section>
          </section>
        )}
      </section>
    </section>
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
        desc
      }
    }
    getSubscriber(id: $id) {
      orgName
    }
  }
`

export const createOrders = /* GraphQL */ `
  mutation CreateOrders($input: CreateOrdersInput!) {
    createOrders(input: $input) {
      id
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

export const getOrders = /* GraphQL */ `
  query GetOrders($id: ID!) {
    getOrders(id: $id) {
      order {
        id
        name
        qty
        price
        rating
        request
        status
      }
      status
    }
  }
`
