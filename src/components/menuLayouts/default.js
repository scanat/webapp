import React, { useState, useEffect, useRef } from "react"
import defaultStyles from "./default.module.css"
import AWS from "aws-sdk"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import Anime from "animejs"
import ConfirmOrder from "./confirmOrder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleLeft,
  faCaretDown,
  faCaretUp,
  faCartPlus,
  faCommentDots,
  faEllipsisH,
  faFilter,
  faInfoCircle,
  faSearch,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"
import {
  faPlusSquare,
  faMinusSquare,
} from "@fortawesome/free-regular-svg-icons"
import FurtherDetails from "./furtherDetails"
import Conversation from "./conversation"
import Carousel from "react-elastic-carousel"
import burger from "../../images/icon/burger.png"

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

  useEffect(() => {
    getData()
  }, [])
  async function getData() {
    try {
      let params = {
        id: props.id,
      }
      await API.graphql(graphqlOperation(itemsData, params)).then(res => {
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

  // useEffect(() => {
  //   API.graphql(graphqlOperation(onUpdateItems)).subscribe({
  //     next: data => {
  //       if (
  //         new URLSearchParams(props.location.search).get("id") ===
  //         data.value.data.onUpdateItems.id
  //       ) {
  //         list.splice(0, list.length)
  //         let temp = [...list]
  //         setList(temp)
  //         getData()
  //         console.log(data)
  //       }
  //     },
  //     error: err => {
  //       console.log(err)
  //     },
  //   })
  // }, [])

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
    openOrderListPanel
      ? Anime({
          targets: orderListPanel.current,
          bottom: ["-300px", 0],
          easing: "linear",
          duration: 200,
        })
      : Anime({
          targets: orderListPanel.current,
          bottom: [0, "-300px"],
          easing: "linear",
          duration: 200,
        })
  }, [openOrderListPanel])

  return (
    <>
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
              <section className={defaultStyles.item}>
                <img
                  src={require(`../../images/icon/${imagesArray[index]}.svg`)}
                  title={index}
                />
                <label className={defaultStyles.itemName}>
                  {item.itemName}
                </label>
                <p className={defaultStyles.itemDescription}>
                  {item.description}iuvlivliuvluyvl
                </p>
                <label className={defaultStyles.itemPrice}>
                  {item.itemPrice}
                </label>
                <section
                  className={defaultStyles.itemOrderToggle}
                  style={{
                    justifyContent: !item.ordered ? "right" : "left",
                    background: !item.ordered ? "grey" : "green",
                  }}
                  onClick={() =>
                    !item.ordered
                      ? addItemToList(item)
                      : removeItemFromList(item)
                  }
                >
                  {!item.ordered ? "+" : "-"}
                </section>
              </section>
            ))}
          {searchList.length === 0 && selectedCategory === "All"
            ? list.map((item, index) => (
                <section className={defaultStyles.item}>
                  <img
                    src={require(`../../images/icon/${imagesArray[index]}.svg`)}
                    title={index}
                  />
                  <label className={defaultStyles.itemName}>
                    {item.itemName}
                  </label>
                  <p className={defaultStyles.itemDescription}>
                    {item.description}iuvlivliuvluyvl
                  </p>
                  <label className={defaultStyles.itemPrice}>
                    {item.itemPrice}
                  </label>
                  <section
                    className={defaultStyles.itemOrderToggle}
                    style={{
                      justifyContent: !item.ordered ? "right" : "left",
                      background: !item.ordered ? "grey" : "green",
                    }}
                    onClick={() =>
                      !item.ordered
                        ? addItemToList(item)
                        : removeItemFromList(item)
                    }
                  >
                    {!item.ordered ? "+" : "-"}
                  </section>
                </section>
              ))
            : filteredList.map((item, index) => (
                <section className={defaultStyles.item}>
                  <img
                    src={require(`../../images/icon/${imagesArray[index]}.svg`)}
                    title={index}
                  />
                  <label className={defaultStyles.itemName}>
                    {item.itemName}
                  </label>
                  <p className={defaultStyles.itemDescription}>
                    {item.description}iuvlivliuvluyvl
                  </p>
                  <label className={defaultStyles.itemPrice}>
                    {item.itemPrice}
                  </label>
                  <section
                    className={defaultStyles.itemOrderToggle}
                    style={{
                      justifyContent: !item.ordered ? "right" : "left",
                      background: !item.ordered ? "grey" : "green",
                    }}
                    onClick={() =>
                      !item.ordered
                        ? addItemToList(item)
                        : removeItemFromList(item)
                    }
                  >
                    {!item.ordered ? "+" : "-"}
                  </section>
                </section>
              ))}
        </section>
        {/* <h1 className={defaultStyles.orgName}>{orgName}</h1>

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
        </section> */}
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
              Next
            </button>
          </section>
        )}

        <section
          ref={orderListPanel}
          className={defaultStyles.orderListPanelContainer}
        >
          <label onClick={() => setOpenOrderListPanel(false)}>
            <FontAwesomeIcon icon={faAngleLeft} size="lg" color="grey" />
          </label>
          <br />
          <br />
          {orderList.map((item, index) => (
            <section key={index}>
              <label>{item.itemName}</label>
              <section>
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  size="lg"
                  onClick={() => incQty(orderList, index)}
                />
                <label>{item.qty}</label>
                <FontAwesomeIcon
                  icon={faMinusSquare}
                  size="lg"
                  onClick={() => decQty(orderList, index)}
                />
              </section>
            </section>
          ))}
          <hr />
          <textarea
            className={defaultStyles.orderListPanelSuggestion}
            maxLength={100}
            placeholder="Suggest your requirements"
          />
          <button onClick={() => setOpenOrderListPanel(!openOrderListPanel)}>
            Send for cooking
          </button>
        </section>

        {/* {orderList.length > 0 && (
          <section
            ref={orderListContainer}
            className={defaultStyles.orderListContainer}
          >
            <section className={defaultStyles.orderListTopShow}>
              <section
                className={defaultStyles.orderListPuller}
                onClick={() => setOrderListPulled(!orderListPulled)}
              >
                <label>{orderList.length} item/s selected</label>
                <button>Send for cooking</button>
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
        )} */}
      </section>
      {confirmOrder && (
        <ConfirmOrder
          orderList={orderList}
          id={props.id}
          key={props.table}
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

const imagesArray = ["pizza", "burger", "meal"]
