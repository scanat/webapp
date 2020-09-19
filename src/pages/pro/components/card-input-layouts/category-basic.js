import React, { useState, useEffect } from "react"
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
} from "@fortawesome/free-solid-svg-icons"
import categoryBasicStyles from "./category-basic.module.css"
import axios from "axios"
import { navigate } from "gatsby"
import { getCurrentUser } from "../../../../utils/auth"
import config from "../../../../config.json"
import SnackBar from "../../../../components/snackBar"
import Layout from "../../../../components/layout"

const Card = props => {
  return (
    <section className={categoryBasicStyles.card}>{props.children}</section>
  )
}

const CategoryBasic = props => {
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [category, setCategory] = useState("None")
  const [changing, setChanging] = useState(false)
  const [list, setList] = useState([])
  const [chosenItem, setChosenItem] = useState()
  const [categoryList, setCategoryList] = useState(["Category"])
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

  useEffect(() => {
    fetchData()
  }, [])

  // Fetch inital data if available
  const fetchData = async () => {
    try {
      const params = JSON.stringify({
        phoneNumber: String(getCurrentUser().phone_number).replace("+91", ""),
      })
      const res = await axios.post(`${config.userDataAPI}/items/get`, params)
      res.data.data.data.map(element => {
        if(categoryList.indexOf(element.category)<0){
          categoryList.push(element.category)
        }
      });
      switchContent("Found Items", true)
      setList(res.data.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const setSelectedCategory = () => {
    let newCategoryName = prompt("Add a category to the list!")
    if (newCategoryName !== null && newCategoryName !== "") {
      setCategoryList(categoryList.concat(newCategoryName.toString()))
    }
  }

  // Adding the items to the list
  const addItemHandler = () => {
    if (
      itemName !== null &&
      itemName !== "" &&
      itemPrice !== null &&
      itemPrice !== ""
    ) {
      setList(
        list.concat({
          _id: Math.random().toString(36).substr(2, 9).toString(),
          itemName: itemName,
          itemPrice: itemPrice,
          status: true,
          category: category.toString(),
        })
      )
      setItemName("")
      setItemPrice("")
      if (typeof window !== "undefined") {
        document.getElementById("item-name-input").value = ""
        document.getElementById("item-price-input").value = ""
      }
    }
  }

  // Reseting the input blocks to empty
  const resetInputHandler = () => {
    setItemName("")
    setItemPrice("")
    setChanging(false)
    setChosenItem()
    if (typeof window !== "undefined") {
      document.getElementById("item-name-input").value = ""
      document.getElementById("item-price-input").value = ""
    }
  }

  // Toggling the active status of the item
  const toggleItemHandler = item => {
    const elementIndex = list.findIndex(element => element._id === item._id)
    let newList = [...list]
    let newListStatus = newList[elementIndex].status
    newList[elementIndex].status = newListStatus ? false : true
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
    var removedItem = newList.splice(elementIndex, 1)[0]
    setList(newList)
    resetInputHandler()
  }

  // Adding the chosen items to input
  const updateItemHandler = item => {
    setChosenItem(item)
    if (typeof window !== "undefined") {
      setItemName(item.itemName)
      setItemPrice(item.itemPrice)
      document.getElementById("item-name-input").value = item.itemName
      document.getElementById("item-price-input").value = item.itemPrice
      setChanging(true)
    }
  }

  // Updating the item finally
  const updateChangeHandler = () => {
    const elementIndex = list.findIndex(
      element => element._id === chosenItem._id
    )
    let newList = [...list]
    newList[elementIndex] = {
      _id: chosenItem._id,
      itemName: itemName,
      itemPrice: itemPrice,
      status: true,
      category: category,
    }
    setList(newList)
    setChanging(false)
    resetInputHandler()
  }

  // Upload Data button press
  const uploadData = async () => {
    try {
      const params = {
        phoneNumber: String(getCurrentUser().phone_number).replace("+91", ""),
        data: list,
        categories: categoryList
      }
      const res = await axios.post(`${config.userDataAPI}/items/add`, params)
      switchContent(res.data.msg, true)
      setTimeout(() => {
        navigate("/profile")
      }, 2000)
    } catch (error) {
      console.log(error)
    }
  }

  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  return (
    <Layout>
      <section className={categoryBasicStyles.container}>
        <Card>
          <section>
            <h3>{changing ? "Update Item" : "Add Item"}</h3>
            <input
              className={categoryBasicStyles.input}
              id="item-name-input"
              onKeyUp={event => setItemName(event.target.value)}
              type="text"
              name="itemname"
              placeholder="Item name"
            />
            <input
              className={categoryBasicStyles.input}
              id="item-price-input"
              onKeyUp={event => setItemPrice(event.target.value)}
              type="number"
              name="itemprice"
              placeholder="Item price"
            />
            <select
              id="item-category-input"
              style={{ width: "90%" }}
              onChange={selected => setCategory(selected.target.value)}
            >
              {categoryList.map(item => (
                <option value={item}>{item}</option>
              ))}
            </select>
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
                icon={faNetworkWired}
                onClick={setSelectedCategory}
                size="lg"
                color="#169188"
              />
              <label className={categoryBasicStyles.controlItemLabel}>
                Add Category
              </label>
            </section>
            <section className={categoryBasicStyles.controlItem}>
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                onClick={list.length > 0 && uploadData}
                size="lg"
                color={list.length > 0 ? "#169188" : "grey"}
              />
              <label className={categoryBasicStyles.controlItemLabel}>
                Upload
              </label>
            </section>
          </section>
        </Card>

        <section className={categoryBasicStyles.listContainer}>
          {list.map(item => (
            <section className={categoryBasicStyles.greenCard} key={item._id}>
              <section className={categoryBasicStyles.textContainers}>
                <p className={categoryBasicStyles.itemName}>{item.itemName}</p>
                <p className={categoryBasicStyles.itemPrice}>
                  Rs {item.itemPrice} /-
                </p>
              </section>
              <label className={categoryBasicStyles.categoryName}>
                <u>Category</u> : {item.category}
              </label>
              <section className={categoryBasicStyles.itemControls}>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => removeItemHandler(item)}
                  onMouseUp={() => removeItemHandler(item)}
                  size="lg"
                  color="#db2626"
                />
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  onClick={() => updateItemHandler(item)}
                  onMouseUp={() => updateItemHandler(item)}
                  size="lg"
                  color="grey"
                />
                <FontAwesomeIcon
                  icon={item.status ? faToggleOn : faToggleOff}
                  onMouseDown={() => toggleItemHandler(item)}
                  size="lg"
                  color={item.status ? "green" : "#db2626"}
                />
              </section>
            </section>
          ))}
        </section>
      </section>
      {snackContent && <SnackBar message={snackContent} err={snackError} />}
    </Layout>
  )
}

export default CategoryBasic
