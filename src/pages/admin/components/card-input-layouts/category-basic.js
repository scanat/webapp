import React, { useState } from "react"
import Card from "../card"
import { IoIosCloseCircleOutline, IoIosRepeat } from "react-icons/io"
import { FcAddRow } from "react-icons/fc"
import { FaPlusCircle } from "react-icons/fa"
import CategoryBasicListCard from "../card-layouts/category-basic-card"
import styled from "styled-components"

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
    <Container>
      <AddCategory onClick={setSelectedCategory}>
        <FaPlusCircle size={20} color="blue" />
        <AddCategoryText>Add Category</AddCategoryText>
      </AddCategory>

      <Card>
        <InputContainer>
          <h3>{changing ? "Update Item" : "Add Item"}</h3>
          <Input
            id="item-name-input"
            onKeyUp={event => setItemName(event.target.value)}
            type="text"
            name="itemname"
            placeholder="Item name"
          />
          <Input
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
            {/* <option value="none">None</option> */}
            {categoryList.map(item => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </InputContainer>

        <ItemControls>
          <IoIosRepeat onClick={resetInputHandler} size={30} color="green" />
          <FcAddRow
            onClick={changing ? updateChangeHandler : addItemHandler}
            size={30}
          />
        </ItemControls>
      </Card>

      <ListContainer>
        <OptionsContainer id="card-change-options">
          <IoIosCloseCircleOutline
            color="white"
            size={30}
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
          <ListItem onClick={() => cardChangeOptionsHandler(true, item)}>
            <CategoryBasicListCard item={item} status={item.status} />
          </ListItem>
        ))}
      </ListContainer>

      {list.length > 0 && (
        <UploadButtonContainer>
          <UploadButton type="button" onClick={uploadData}>
            Upload Data
          </UploadButton>
        </UploadButtonContainer>
      )}
    </Container>
  )
}

const Container = styled.section`
    position: relative;
    overflow: hidden;
    float: left;
    display: flex;
    flex: 1;
    flex-direction: column;
  `,
  Input = styled.input`
    width: 90%;
    border-radius: 5px;
    font-size: 16px;
    margin: 5px 5%;
    border: none;
    padding: 5px;
  `,
  InputContainer = styled.section`
    padding: 5px;
  `,
  ItemControls = styled.section`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 5px;
    align-items: center;
    justify-content: center;
  `,
  ListContainer = styled.section`
    width: 100%;
    align-items: center;
    overflow-x: scroll;
    position: relative;
  `,
  OptionsContainer = styled.section`
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
  `,
  UploadButtonContainer = styled.section`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: blue;
    padding: 10px;
  `,
  UploadButton = styled.button`
    width: 200px;
    background: white;
    padding: 5px;
    font-size: 14px;
    border: none;
    border-radius: 10px;
  `,
  ListItem = styled.li``,
  AddCategory = styled.section`
    position: absolute;
    top: 0;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  `,
  AddCategoryText = styled.p`
    background: yellow;
    padding: 2px 5px;
    border-radius: 5px;
    font-size: 10px;
    font-weight: bold;

    ${AddCategory}:hover & {
      cursor: pointer;
    }
  `

export default Basic
