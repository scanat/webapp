import React, { useState, useEffect, useRef, useCallback } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlusSquare,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons"
import {
  faSyncAlt,
  faNetworkWired,
  faCloudUploadAlt,
  faTrash,
  faPencilAlt,
  faToggleOn,
  faToggleOff,
  faCut,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons"
import categoryBasicStyles from "./category-basic.module.css"
import AWS from "aws-sdk"
import { getCurrentUser } from "../../utils/auth"
import SnackBar from "../snackBar"
import Layout from "../layout"
import Loader from "../loader"
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify"
// import ReactCrop from "react-image-crop"
import SwipeableViews from "react-swipeable-views"
import awsmobile from "../../aws-exports"
import cross from "../../images/icons/cross.png"
import pencil from "../../images/icons/pencil.png"
import tick from "../../images/icons/tick.png"
import meat from "../../images/icons/categories/meat.svg"
import pizza from "../../images/icons/categories/pizza.svg"
import rice from "../../images/icons/categories/rice.svg"

// const subscriberItemsS3 = new AWS.S3({
//   region: "ap-south-1",
//   accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
//   secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
// })

// Amplify.configure(awsmobile)

// const pixelRatio =
//   (typeof window !== "undefined" && window.devicePixelRatio) || 1

const Card = props => {
  return (
    <section className={categoryBasicStyles.card}>{props.children}</section>
  )
}

const CategoryBasic = props => {
  const [category, setCategory] = useState("None")
  const [changing, setChanging] = useState(false)
  const [list, setList] = useState([])
  const [itemImageList, setItemImageList] = useState([])
  const [chosenItem, setChosenItem] = useState()
  const [categoryList, setCategoryList] = useState(["Category"])
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewIndex, setViewIndex] = useState(0)
  const [closeCategory, setCloseCategory] = useState(true)
  const [takeaway, setTakeaway] = useState(true)
  const [delivery, setDelivery] = useState(true)
  const [veg, setVeg] = useState(true)
  const [categoryEdit, setCategoryEdit] = useState(false)

  const itemNameRef = useRef("")
  const itemPriceRef = useRef("")
  const itemDescRef = useRef("")
  const inputCategoryRef = useRef(null)
  const [displayCategory, setDisplayCategory] = useState(false)
  const [choiceCategory, setChoiceCategory] = useState("Category")

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

  useEffect(() => {
    fetchData()
  }, [])

  const deleteCategory = id => {
    const tempList = [...categoryList]
    tempList.splice(id, 1)
    setCategoryList(tempList)
  }

  // Fetch inital data if available
  const fetchData = async () => {
    setLoading(true)
    try {
      await API.graphql(
        graphqlOperation(getItemsPressence, {
          id: getCurrentUser()["custom:page_id"],
        })
      ).then(async data => {
        data.data.getItems === null
          ? await API.graphql(
              graphqlOperation(createItemsPressence, {
                input: { id: getCurrentUser()["custom:page_id"], itemList: [] },
              })
            )
          : await API.graphql(
              graphqlOperation(getItems, {
                id: getCurrentUser()["custom:page_id"],
              })
            ).then(data => {
              setList(data.data.getItems.itemList)
              setCategoryList(data.data.getItems.category)
            })
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
    }
  }

  // Adding the items to the list
  const addItemHandler = () => {
    setLoading(true)
    if (
      itemNameRef.current.value.length > 0 &&
      itemPriceRef.current.value > 0
    ) {
      let tempList = [...list]
      tempList.push({
        id: Math.random().toString(36).substr(2, 9).toString(),
        itemName: itemNameRef.current.value,
        itemPrice: itemPriceRef.current.value,
        status: true,
        category: choiceCategory,
        // image: imageUrl,
        desc: itemDescRef.current.value,
      })
      setList(tempList)
      // uploadImage()
      itemNameRef.current.value = ""
      itemPriceRef.current.value = ""
      itemDescRef.current.value = ""
      // setImageDetails({ name: "", type: "", image: "" })
    }
    setLoading(false)
  }

  // Reseting the input blocks to empty
  const resetInputHandler = () => {
    itemNameRef.current.value = ""
    itemPriceRef.current.value = ""
    itemDescRef.current.value = ""

    // setImageDetails({ name: "", type: "", image: "" })
    setChanging(false)
    setChosenItem()
  }

  // Toggling the active status of the item
  const toggleItemHandler = item => {
    const elementIndex = list.findIndex(element => element.id === item.id)
    let newList = [...list]
    newList[elementIndex].status = newList[elementIndex].status ? false : true
    setList(newList)
  }

  // Removing the item from the list
  const removeItemHandler = item => {
    const confirmDelete =
      typeof window !== "undefined" &&
      window.confirm(
        "Are you sure to delete item? Alternatively you can toggle OFF the item."
      )
    confirmDelete
      ? deleteItem(item)
      : switchContent(
          "Toggling items hide the items visibility in your menu",
          true
        )
  }

  // delete Item Function
  const deleteItem = item => {
    const elementIndex = list.findIndex(element => element._id === item._id)
    let newList = [...list]
    const removedItem = newList.splice(elementIndex, 1)[0]
    setList(newList)
    resetInputHandler()
  }

  // Adding the chosen items to input
  const updateItemHandler = item => {
    setChosenItem(item)
    console.log(item)
    itemNameRef.current.value = item.itemName
    itemPriceRef.current.value = item.itemPrice
    itemDescRef.current.value = item.desc
    setChanging(true)
  }

  // Updating the item finally
  const updateChangeHandler = () => {
    const temp = [...list]
    temp.map(item => {
      if (item.id === chosenItem.id) {
        item.itemName = itemNameRef.current.value
        item.itemPrice = itemPriceRef.current.value
        item.desc = itemDescRef.current.value
        item.category = choiceCategory
        // item.image = imageUrl
      }
    })
    setList(temp)
    setChanging(false)
    resetInputHandler()
  }

  // Upload Data button press
  const uploadData = async () => {
    setLoading(true)
    try {
      const inputs = {
        input: {
          id: getCurrentUser()["custom:page_id"],
          itemList: list,
        },
      }
      await API.graphql(graphqlOperation(updateItemsList, inputs)).then(data =>
        // navigate("/profile")
        updateCategoriesList()
      )
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  useEffect(() => {
    setDisplayCategory(false)
  }, [choiceCategory])

  async function updateCategoriesList() {
    setLoading(true)
    let temp = []
    list.map(item => {
      temp.push(item.category)
    })
    let uniqueCategory = [...new Set(temp)]
    console.log(uniqueCategory)
    try {
      let input = {
        input: {
          id: getCurrentUser()["custom:page_id"],
          category: categoryList,
        },
      }
      await API.graphql(graphqlOperation(updateItemsList, input)).then(res =>
        console.log(res)
      )
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const categoryInputOpt = id => {
    setCloseCategory(!closeCategory)
    if (!categoryEdit) {
      inputCategoryRef.current.value.length > 0 &&
        setCategoryList(categoryList.concat(inputCategoryRef.current.value))
      inputCategoryRef.current.value.length > 0 &&
        (inputCategoryRef.current.value = "")
    } else {
      let tempList = [...categoryList]
      tempList[id] = inputCategoryRef.current.value
      setCategoryList(tempList)
      setCategoryEdit(false)
    }
  }

  return (
    <Layout>
      <Loader loading={loading} />
      <section className={categoryBasicStyles.container}>
        <ul className={categoryBasicStyles.navigation}>
          <li
            onClick={() => setViewIndex(0)}
            style={{
              color: viewIndex === 0 ? "white" : "whitesmoke",
              letterSpacing: viewIndex === 0 ? "1px" : "0.5px",
              bold: viewIndex === 0 ? "bold" : "normal"
            }}
          >
            Product
          </li>
          <li
            onClick={() => setViewIndex(1)}
            style={{
              color: viewIndex === 1 ? "white" : "whitesmoke",
              letterSpacing: viewIndex === 1 ? "1px" : "0.5px",
              bold: viewIndex === 1 ? "bold" : "normal"
            }}
          >
            Category
          </li>
        </ul>

        <Card>
          <SwipeableViews index={viewIndex}>
            <div>
              <section>
                {/* <h3>Product Handler</h3> */}
                {/* <h3>{changing ? "Update Item" : "Add Item"}</h3> */}
                <input
                  className={categoryBasicStyles.input}
                  type="text"
                  placeholder="Item name"
                  ref={itemNameRef}
                />
                <input
                  className={categoryBasicStyles.input}
                  type="number"
                  placeholder="Item price"
                  ref={itemPriceRef}
                />
                <ul className={categoryBasicStyles.categoryDropdown}>
                  <li>
                    <label onClick={() => setDisplayCategory(!displayCategory)}>
                      {choiceCategory ? choiceCategory : "Select Category"}
                    </label>
                    <ul style={{ display: displayCategory ? "block" : "none" }}>
                      {categoryList.map((item, id) => (
                        <li key={id} onClick={() => setChoiceCategory(item)}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </section>

              <section className={categoryBasicStyles.itemControls}>
                <section className={categoryBasicStyles.controlItem}>
                  <FontAwesomeIcon
                    icon={faSyncAlt}
                    onClick={resetInputHandler}
                    size="lg"
                    color="#169188"
                  />
                  <label className={categoryBasicStyles.controlItemLabel}>
                    Reset
                  </label>
                </section>
                <section className={categoryBasicStyles.controlItem}>
                  <FontAwesomeIcon
                    icon={changing ? faCheckCircle : faPlusSquare}
                    onClick={changing ? updateChangeHandler : addItemHandler}
                    size="lg"
                    color="#169188"
                  />
                  <label className={categoryBasicStyles.controlItemLabel}>
                    Add Item
                  </label>
                </section>
                <section className={categoryBasicStyles.controlItem}>
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    onClick={list.length > 0 ? uploadData : null}
                    size="lg"
                    color={list.length > 0 ? "#169188" : "grey"}
                  />
                  <label className={categoryBasicStyles.controlItemLabel}>
                    Upload
                  </label>
                </section>
              </section>

              <section className={categoryBasicStyles.itemControls}>
                <section
                  style={{
                    width: "60px",
                    border: takeaway ? "2px green solid" : "none",
                    background: takeaway ? "white" : "#c13333",
                    padding: "5px 10px",
                    fontSize: "0.7em",
                    letterSpacing: "0.5px",
                    color: takeaway ? "black" : "white",
                  }}
                  onClick={() => setTakeaway(!takeaway)}
                >
                  Takeaway
                </section>
                <section
                  style={{
                    width: "60px",
                    border: delivery ? "2px green solid" : "none",
                    background: delivery ? "white" : "#c13333",
                    padding: "5px 10px",
                    fontSize: "0.7em",
                    letterSpacing: "0.5px",
                    color: delivery ? "black" : "white",
                  }}
                  onClick={() => setDelivery(!delivery)}
                >
                  Delivery
                </section>
                <section
                  style={{
                    width: "60px",
                    border: veg ? "2px green solid" : "none",
                    background: veg ? "white" : "#c13333",
                    padding: "5px 10px",
                    fontSize: "0.7em",
                    letterSpacing: "0.5px",
                    color: veg ? "black" : "white",
                  }}
                  onClick={() => setVeg(!veg)}
                >
                  {veg ? "Veg" : "Non-Veg"}
                </section>
              </section>

              <section className={categoryBasicStyles.itemControls}>
                <textarea
                  ref={itemDescRef}
                  placeholder="Enter product description..."
                  maxLength={100}
                />
              </section>
            </div>
            <div>
              <section className={categoryBasicStyles.categoryContainer}>
                <ul>
                  {categoryList.map(
                    (item, id) =>
                      item !== "Category" && (
                        <li key={id}>
                          {item}
                          <section
                            className={categoryBasicStyles.categoryChangeArea}
                          >
                            <img
                              src={pencil}
                              onClick={() => {
                                inputCategoryRef.current.value = item
                                setCloseCategory(false)
                                setCategoryEdit(true)
                                categoryInputOpt(id)
                              }}
                            />
                            <img
                              src={cross}
                              onClick={() => deleteCategory(id)}
                            />
                          </section>
                        </li>
                      )
                  )}
                </ul>
                <input
                  className={categoryBasicStyles.categoryEntryInput}
                  type="text"
                  placeholder="Delux Gravy"
                  hidden={closeCategory}
                  ref={inputCategoryRef}
                />
                <button
                  className={categoryBasicStyles.addCategoryBtn}
                  onClick={categoryInputOpt}
                >
                  +
                </button>
                <button
                  className={categoryBasicStyles.finalCategoryBtn}
                  onClick={updateCategoriesList}
                >
                  <img src={tick} />
                </button>
              </section>
            </div>
          </SwipeableViews>
        </Card>

        <section className={categoryBasicStyles.listContainer}>
          {list.map((item, id) => (
            <section className={categoryBasicStyles.greenCard} key={item.id}>
              <section className={categoryBasicStyles.parentDataContainer}>
                <section className={categoryBasicStyles.basicDataContainer}>
                  <section className={categoryBasicStyles.textContainers}>
                    <section>
                      {/* {item.category && (
                        <img
                          srcSet={require("../../images/icons/categories/" +
                            item.category.toLowerCase() +
                            ".svg")}
                        />
                      )} */}
                      <p className={categoryBasicStyles.itemName}>
                        {item.itemName}
                      </p>
                    </section>
                    <p className={categoryBasicStyles.itemPrice}>
                      Rs {item.itemPrice} /-
                    </p>
                  </section>
                  {/* <label className={categoryBasicStyles.categoryName}>
                    <u>Category</u> : {item.category}
                  </label> */}
                </section>
              </section>
              <section className={categoryBasicStyles.itemControls}>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => removeItemHandler(item)}
                  size="lg"
                  color="#db2626"
                />
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  onClick={() => updateItemHandler(item)}
                  size="lg"
                  color="grey"
                />
                <FontAwesomeIcon
                  icon={item.status ? faToggleOn : faToggleOff}
                  onClick={() => toggleItemHandler(item)}
                  size="lg"
                  color={item.status ? "green" : "#db2626"}
                />
              </section>
              {!item.status && (
                <label>This item has been marked deactivated!</label>
              )}
            </section>
          ))}
        </section>
      </section>
      {snackContent && <SnackBar message={snackContent} err={snackError} />}
    </Layout>
  )
}

export default CategoryBasic

export const updateItemsList = /* GraphQL */ `
  mutation UpdateItems($input: UpdateItemsInput!) {
    updateItems(input: $input) {
      id
    }
  }
`
export const getItemsPressence = /* GraphQL */ `
  query GetItems($id: ID!) {
    getItems(id: $id) {
      id
    }
  }
`
export const createItemsPressence = /* GraphQL */ `
  mutation CreateItems($input: CreateItemsInput!) {
    createItems(input: $input) {
      id
    }
  }
`
export const getItems = /* GraphQL */ `
  query GetItems($id: ID!) {
    getItems(id: $id) {
      itemList {
        id
        category
        itemName
        itemPrice
        status
        desc
      }
      category
    }
  }
`
