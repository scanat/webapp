import React, { useState, useEffect, useRef } from "react"
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
import axios from "axios"
import { navigate } from "gatsby"
import { getCurrentUser } from "../../../../utils/auth"
import config from "../../../../config.json"
import SnackBar from "../../../../components/snackBar"
import Layout from "../../../../components/layout"
import Loader from "../../../../components/loader"

const subscriberPageS3 = new AWS.S3({
  region: "ap-south-1",
  apiVersion: "2006-03-01",
  accessKeyId: process.env.S3_ACCESS_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

const itemsPageDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
  apiVersion: "2012-08-10",
  accessKeyId: process.env.ITEM_DB_ACCESS_ID,
  secretAccessKey: process.env.ITEM_DB_SECRET_ACCESS_KEY,
})

const Card = props => {
  return (
    <section className={categoryBasicStyles.card}>{props.children}</section>
  )
}

const CategoryBasic = props => {
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [itemImage, setItemImage] = useState("")
  const [category, setCategory] = useState("None")
  const [changing, setChanging] = useState(false)
  const [list, setList] = useState([])
  const [itemImageList, setItemImageList] = useState([])
  const [chosenItem, setChosenItem] = useState()
  const [categoryList, setCategoryList] = useState(["Category"])
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)
  const itemImageForm = useRef(null)
  const uploadItemImageInput = useRef(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

  useEffect(() => {
    fetchData()
  }, [])

  // Delete Category
  const deleteCategory = () => {
    const tempList = [...categoryList]
    const index = tempList.indexOf(category)
    tempList.splice(index, 1)
    setCategoryList(tempList)
  }

  // Fetch inital data if available
  const fetchData = async () => {
    setLoading(true)
    try {
      const params = {
        TableName: "items",
        Key: {
          phoneNumber: String(getCurrentUser().phone_number).replace("+91", ""),
        },
      }
      await itemsPageDb.get(params, (err, data) => {
        if (data) {
          data.Item.data.map(element => {
            if (categoryList.indexOf(element.category) < 0) {
              categoryList.push(element.category)
            }
            getImage(element.image)
          })
          switchContent("Found Items", true)
          setList(data.Item.data)
        }
        setLoading(false)
      })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  async function getImage(fileName) {
    setLoading(true)
    const paramsGet = {
      Bucket: "subscriber-media",
      Key: `Items/${String(getCurrentUser().phone_number).replace(
        "+91",
        ""
      )}/${fileName}`,
    }
    await subscriberPageS3.getObject(paramsGet, (err, resp) => {
      resp && itemImageList.push(resp.Body)
      err && itemImageList.push("")
      let tempList = [...itemImageList]
      setItemImageList(tempList)
      setLoading(false)
    })
  }

  const setSelectedCategory = () => {
    let newCategoryName = prompt("Add a category to the list!")
    if (newCategoryName !== null && newCategoryName !== "") {
      setCategoryList(categoryList.concat(newCategoryName.toString()))
    }
  }

  // Adding the items to the list
  const addItemHandler = () => {
    setLoading(true)
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
          image: itemImage,
        })
      )
      setItemImageList(itemImageList.concat(""))
      setItemName("")
      setItemPrice("")
      if (typeof window !== "undefined") {
        document.getElementById("item-name-input").value = ""
        document.getElementById("item-price-input").value = ""
      }
      setLoading(false)
    }
    setLoading(false)
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
      image: itemImage,
    }
    setList(newList)
    setChanging(false)
    resetInputHandler()
  }

  // Upload Data button press
  const uploadData = async () => {
    setLoading(true)
    try {
      const params = {
        TableName: "items",
        ExpressionAttributeNames: {
          "#d": "data",
          "#c": "categories",
        },
        ExpressionAttributeValues: {
          ":dl": list,
          ":cl": categoryList,
        },
        Key: {
          phoneNumber: String(getCurrentUser().phone_number).replace("+91", ""),
        },
        UpdateExpression: "SET #d = :dl, #c = :cl",
      }
      itemsPageDb.update(params, (err, data) => {
        setLoading(false)
      })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const selectImage = async (e, item) => {
    setLoading(true)
    const selectedFile = e.target.files[0]
    const reader = new FileReader(selectedFile)
    reader.readAsDataURL(selectedFile)
    reader.onload = async () => {
      item.image = selectedFile["name"]
      console.log(item)
      console.log(list)
      uploadImage(selectedFile, reader.result)
    }
    setLoading(false)
  }

  const uploadImage = async (selectedFile, imgUri) => {
    setLoading(true)
    try {
      const params = {
        Bucket: "subscriber-media",
        Key: `Items/${String(getCurrentUser().phone_number).replace(
          "+91",
          ""
        )}/${selectedFile["name"]}`,
        Body: imgUri,
      }

      await subscriberPageS3.upload(params, (err, resp) => {
        setLoading(false)
        console.log(resp)
      })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  return (
    <Layout>
      <Loader loading={loading} />
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
            <section className={categoryBasicStyles.controlItem}>
              <FontAwesomeIcon
                icon={faCut}
                onClick={deleteCategory}
                size="lg"
                color={list.length > 0 ? "#169188" : "grey"}
              />
              <label className={categoryBasicStyles.controlItemLabel}>
                Delete Category
              </label>
            </section>
          </section>
        </Card>

        <section className={categoryBasicStyles.listContainer}>
          {list.map((item, id) => (
            <section className={categoryBasicStyles.greenCard} key={item._id}>
              <section className={categoryBasicStyles.parentDataContainer}>
                <section className={categoryBasicStyles.itemImageContainer}>
                  {item["image"] !== "" ? (
                    <img
                      src={itemImageList[id]}
                      alt={item["image"]}
                      className={categoryBasicStyles.itemImage}
                    />
                  ) : (
                    <section
                      className={categoryBasicStyles.itemImageInstructions}
                    >
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        size="lg"
                        color="#169188"
                        onClick={() => uploadItemImageInput.current.click()}
                      />
                      <form ref={itemImageForm} hidden>
                        <input
                          ref={uploadItemImageInput}
                          id="itemId"
                          type="file"
                          onChange={e => selectImage(e, item)}
                          hidden
                        />
                        <button type="submit"></button>
                      </form>
                    </section>
                  )}
                </section>
                <section className={categoryBasicStyles.basicDataContainer}>
                  <section className={categoryBasicStyles.textContainers}>
                    <p className={categoryBasicStyles.itemName}>
                      {item.itemName}
                    </p>
                    <p className={categoryBasicStyles.itemPrice}>
                      Rs {item.itemPrice} /-
                    </p>
                  </section>
                  <label className={categoryBasicStyles.categoryName}>
                    <u>Category</u> : {item.category}
                  </label>
                </section>
              </section>
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
