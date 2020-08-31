import React, { useState, useEffect } from "react"
import Card from "../card"
import { IoIosCloseCircleOutline, IoIosRepeat } from "react-icons/io"
import { FcAddRow } from "react-icons/fc"
import BasicListCard from "../card-layouts/basic-card"
import styled from "styled-components"
import axios from "axios"
import { navigate } from "gatsby"

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
      const params = {
        phoneNumber: JSON.parse(localStorage.getItem("userData")).phoneNumber,
      }
      const res = await axios.post(
        `https://dn5kjkew1c.execute-api.ap-south-1.amazonaws.com/beta/items/get`,
        params
      )
      alert(res.data.msg)
      console.log(res.data.item)
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
      if (typeof window !== 'undefined') {
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
    if (typeof window !== 'undefined') {
      document.getElementById("item-name-input").value = ""
      document.getElementById("item-price-input").value = ""
      document.getElementById("card-change-options").style.display = "none"
    }
  }

  // Displaying the options to handle changes in the list
  const cardChangeOptionsHandler = (visibile, item) => {
    if (typeof window !== 'undefined') {
      visibile
        ? (document.getElementById("card-change-options").style.display =
            "block")
        : (document.getElementById("card-change-options").style.display =
            "none")

      setChosenItem(item)
    }
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
    if (typeof window !== 'undefined')
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
    if (typeof window !== 'undefined') {
      setItemName(chosenItem.itemName)
      setItemPrice(chosenItem.itemPrice)
      document.getElementById("item-name-input").value = chosenItem.itemName
      document.getElementById("item-price-input").value = chosenItem.itemPrice
      setChanging(true)
      document.getElementById("card-change-options").style.display = "none"
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
  // Sort all lists add, update and remove item from list for existing list and send through post
  // Sort all lists for update and remove for fetched list and apply PATCH and DELETE API calls
  const uploadData = async () => {
    try {
      const params = {
        phoneNumber: JSON.parse(localStorage.getItem("userData")).phoneNumber,
        data: list,
      }
      const res = await axios.post(
        `https://dn5kjkew1c.execute-api.ap-south-1.amazonaws.com/beta/items/add`,
        params
      )
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
    <section
      style={{
        overflow: "hidden",
        position: "relative",
        float: "left",
        display: "flex",
        flex: 1,
        flexDirection: "column",
      }}
    >
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
          <ListItem
            onClick={() => cardChangeOptionsHandler(true, item)}
            key={item._id}
          >
            <BasicListCard itemName={item.itemName} itemPrice={item.itemPrice} status={item.status} />
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
    </section>
  )
}

const Input = styled.input`
    width: 90%;
    border-radius: 5px;
    font-size: 16px;
    margin: 5px 5%;
    border: none;
    padding: 5px;
  `,
  InputContainer = styled.section`
    padding: 0px;
  `,
  ItemControls = styled.section`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0px;
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
  ListItem = styled.li``

export default Basic
