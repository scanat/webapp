import React, { useState } from "react"
import Card from "../card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusSquare, faCheckCircle } from "@fortawesome/free-regular-svg-icons"
import { faSyncAlt, faTimes, faNetworkWired, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"
import categoryBasicStyles from "./category-basic.module.css"

const Basic = props => {
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [category, setCategory] = useState("None")
  const [changing, setChanging] = useState(false)
  const [list, setList] = useState([])
  const [chosenItem, setChosenItem] = useState()
  const [categoryList, setCategoryList] = useState(["Category"])

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
      document.getElementById("item-name-input").value = ""
      document.getElementById("item-price-input").value = ""
    }
  }

  // Reseting the input blocks to empty
  const resetInputHandler = () => {
    setItemName("")
    setItemPrice("")
    setChanging(false)
    setChosenItem()
    document.getElementById("item-name-input").value = ""
    document.getElementById("item-price-input").value = ""
    document.getElementById("card-change-options").style.display = "none"
  }

  // Displaying the options to handle changes in the list
  const cardChangeOptionsHandler = (visibile, item) => {
    visibile
      ? (document.getElementById("card-change-options").style.display = "block")
      : (document.getElementById("card-change-options").style.display = "none")

    setChosenItem(item)
  }

  // Toggling the active status of the item
  const toggleItemHandler = () => {
    const elementIndex = list.findIndex(
      element => element._id === chosenItem._id
    )
    let newList = [...list]
    let newListStatus = newList[elementIndex].status
    newList[elementIndex].status = newListStatus ? false : true
    setList(newList)
    setChosenItem()
    document.getElementById("card-change-options").style.display = "none"
  }

  // Removing the item from the list
  const removeItemHandler = () => {
    const elementIndex = list.findIndex(
      element => element._id === chosenItem._id
    )
    let newList = [...list]
    var removedItem = newList.splice(elementIndex, 1)[0]
    setList(newList)
    resetInputHandler()
  }

  // Adding the chosen items to input
  const updateItemHandler = () => {
    setItemName(chosenItem.itemName)
    setItemPrice(chosenItem.itemPrice)
    setCategory(chosenItem.category)
    document.getElementById("item-category-input").value = chosenItem.category
    document.getElementById("item-name-input").value = chosenItem.itemName
    document.getElementById("item-price-input").value = chosenItem.itemPrice
    setChanging(true)
    document.getElementById("card-change-options").style.display = "none"
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
  // Sort all lists add, update and remove item from list for existing list and send through post
  // Sort all lists for update and remove for fetched list and apply PATCH and DELETE API calls
  const uploadData = async () => {
    // var paramString = getURL();
    // var searchParams = new URLSearchParams(paramString);
    // var userId = searchParams.get("/linear-layout?id");
    // alert(userId)
  }

  return (
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
            icon={faNetworkWired}
            onClick={resetInputHandler}
            size="lg"
            color="#169188"
          />
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            onClick={list.length > 0 && uploadData}
            size="lg"
            color={list.length > 0 ? "#169188" : 'grey'}
          />
        </section>
      </Card>

      <section className={categoryBasicStyles.listContainer}>
        <OptionsContainer id="card-change-options">
          <FontAwesomeIcon
            icon={faTimes}
            color="#e2e2e2"
            size="2x"
            style={{ float: "right" }}
            onClick={() => cardChangeOptionsHandler(false, chosenItem)}
          />
          <OptionsHolder>
            <CardHandlerButton type="button" onClick={removeItemHandler}>
              Remove
            </CardHandlerButton>
            <CardHandlerButton type="button" onClick={updateItemHandler}>
              Update
            </CardHandlerButton>
            <CardHandlerButton type="button" onClick={toggleItemHandler}>
              Toggle availability
            </CardHandlerButton>
          </OptionsHolder>
        </OptionsContainer>

        {list.map(item => (
          <section onClick={() => cardChangeOptionsHandler(true, item)}>
            <CategoryBasicCard
              itemName={item.itemName}
              itemPrice={item.itemPrice}
              status={item.status}
            />
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

const CategoryBasicCard = props => {
  return (
    <section
      className={
        props.status
          ? categoryBasicStyles.greenCard
          : categoryBasicStyles.redCard
      }
    >
      <p className={categoryBasicStyles.itemName}>{props.itemName}</p>
      <p className={categoryBasicStyles.itemPrice}>Rs {props.itemPrice} /-</p>
    </section>
  )
}
