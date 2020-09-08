import React, { useState, useEffect } from "react"
import Card from "../card"
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
import styled from "styled-components"
import axios from "axios"
import { navigate } from "gatsby"
import { getCurrentUser } from "../../../../utils/subsAuth"
import config from "../../../../config.json"
import basicStyles from "./basic.module.css"

const Basic = props => {
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [changing, setChanging] = useState(false)
  const [list, setList] = useState([])
  const [chosenItem, setChosenItem] = useState()

  useEffect(() => {
    fetchData()
  }, [])

  // Fetch inital data if available
  const fetchData = async () => {
    try {
      const params = JSON.stringify({
        phoneNumber: getCurrentUser().phoneNumber,
      })
      const res = await axios.post(`${config.invokeUrl}/items/get`, params)
      alert(res.data.msg)
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
    console.log(list)
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
        phoneNumber: getCurrentUser().phoneNumber,
        data: list,
      }
      const res = await axios.post(`${config.invokeUrl}/items/add`, params)
      if (res.status === 201) {
        alert(res.data.msg)
        navigate("/admin")
      } else {
        alert(res.data.msg)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
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
          <FontAwesomeIcon
            icon={faSyncAlt}
            onClick={resetInputHandler}
            size="lg"
            color="#169188"
          />
          <FontAwesomeIcon
            icon={changing ? faCheckCircle : faPlusSquare}
            onClick={changing ? updateChangeHandler : addItemHandler}
            size="lg"
            color="#169188"
          />
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            onClick={list.length > 0 && uploadData}
            size="lg"
            color={list.length > 0 ? "#169188" : "grey"}
          />
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
          </section>
        ))}
      </section>
    </section>
  )
}

const OptionsContainer = styled.section`
    position: fixed;
    width: 100%;
    height: 100vh;
    display: none;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
  `,
  OptionsHolder = styled.section`
    display: flex;
    flex-direction: column;
    width: 70%;
    margin: 20px 15%;
    z-index: 2;
    background: transparent;
    border-radius: 10px;
    border: white 4px solid;
    padding: 20px;
  `,
  CardHandlerButton = styled.button`
    width: 80%;
    margin: 5px 10%;
    font-size: 0.8em;
    border: none;
    background: white;
    border-radius: 10px;
    padding: 8px;
  `

export default Basic
