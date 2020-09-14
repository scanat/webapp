import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlusSquare,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons"
import {
  faSyncAlt,
  faCloudUploadAlt,
  faTrash,
  faPencilAlt,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { navigate } from "gatsby"
import { getCurrentUser } from "../../../../utils/auth"
import config from "../../../../config.json"
import basicStyles from "./basic.module.css"
import SnackBar from "../../../../components/snackBar"
import Layout from "../../../../components/layout"

const Card = props => {
  return <section className={basicStyles.card}>{props.children}</section>
}

const Basic = props => {
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [changing, setChanging] = useState(false)
  const [list, setList] = useState([])
  const [chosenItem, setChosenItem] = useState()
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
      switchContent("Found Items", true)
      setList(res.data.item)
    } catch (error) {
      console.log(error)
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
      }
      const res = await axios.post(`${config.userDataAPI}/items/add`, params)
      if (res.status === 201) {
        switchContent(res.data.msg, true)
        setTimeout(() => {
          navigate("/profile")
        }, 2000)
      } else {
        switchContent(res.data.msg, false)
      }
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
      <section className={basicStyles.container}>
        <Card>
          <section>
            <h3>{changing ? "Update Item" : "Add Item"}</h3>
            <input
              className={basicStyles.input}
              id="item-name-input"
              onKeyUp={event => setItemName(event.target.value)}
              type="text"
              name="itemname"
              placeholder="Item name"
            />
            <input
              className={basicStyles.input}
              id="item-price-input"
              onKeyUp={event => setItemPrice(event.target.value)}
              type="number"
              name="itemprice"
              placeholder="Item price"
            />
          </section>

          <section className={basicStyles.itemControls}>
            <section className={basicStyles.controlItem}>
              <FontAwesomeIcon
                icon={faSyncAlt}
                onClick={resetInputHandler}
                onMouseUp={resetInputHandler}
                size="lg"
                color="#169188"
              />
              <label className={basicStyles.controlItemLabel}>Reset</label>
            </section>
            <section className={basicStyles.controlItem}>
              <FontAwesomeIcon
                icon={changing ? faCheckCircle : faPlusSquare}
                onClick={changing ? updateChangeHandler : addItemHandler}
                onMouseUp={changing ? updateChangeHandler : addItemHandler}
                size="lg"
                color="#169188"
              />
              <label className={basicStyles.controlItemLabel}>Add Item</label>
            </section>
            <section className={basicStyles.controlItem}>
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                onClick={list.length > 0 && uploadData}
                onMouseUp={list.length > 0 && uploadData}
                size="lg"
                color={list.length > 0 ? "#169188" : "grey"}
              />
              <label className={basicStyles.controlItemLabel}>Upload</label>
            </section>
          </section>
        </Card>

        <section className={basicStyles.listContainer}>
          {list.map(item => (
            <section className={basicStyles.greenCard} key={item._id}>
              <section className={basicStyles.textContainers}>
                <p className={basicStyles.itemName}>{item.itemName}</p>
                <p className={basicStyles.itemPrice}>Rs {item.itemPrice} /-</p>
              </section>
              <section className={basicStyles.itemControls}>
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

export default Basic
