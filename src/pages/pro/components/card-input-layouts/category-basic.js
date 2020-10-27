import React, { useState, useEffect, useRef, useCallback } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlusSquare,
  faCheckCircle
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
import { getCurrentUser } from "../../../../utils/auth"
import SnackBar from "../../../../components/snackBar"
import Layout from "../../../../components/layout"
import Loader from "../../../../components/loader"
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify"
import ReactCrop from "react-image-crop"
import awsmobile from "../../../../aws-exports"

const subscriberItemsS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

Amplify.configure(awsmobile)

const pixelRatio =
  (typeof window !== "undefined" && window.devicePixelRatio) || 1

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
  const itemImageForm = useRef(null)
  const uploadItemImageInput = useRef(null)
  const [loading, setLoading] = useState(false)

  const itemNameRef = useRef("")
  const itemPriceRef = useRef("")
  const itemCategoryRef = useRef("")
  const itemImageRef = useRef("")
  const [imageUrl, setImageUrl] = useState("")

  const cropRef = useRef("")
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [imageSelector, setImageSelector] = useState(false)
  const [crop, setCrop] = useState({ aspect: 10 / 7, width: 320 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imageDetails, setImageDetails] = useState({
    name: "",
    type: "",
    image: "",
  })

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

  useEffect(() => {
    fetchData()
  }, [])

  const onLoad = useCallback(img => {
    imgRef.current = img
  })

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext("2d")

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = "medium"

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
  }, [completedCrop])

  async function getIndividualImage(key) {
    setLoading(true)
    try {
      const paramsImg = {
        Bucket: awsmobile.aws_user_files_s3_bucket,
        Key: "public/" + key,
      }
      await subscriberItemsS3.getObject(paramsImg, (err, resp) => {
        let temp = imageDetails
        temp.image = resp.Body
        setImageDetails(temp)
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  function getCroppedImg(canvas, newWidth, newHeight) {
    const tmpCanvas = document.createElement("canvas")
    tmpCanvas.width = newWidth
    tmpCanvas.height = newHeight

    const ctx = tmpCanvas.getContext("2d")
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      newWidth,
      newHeight
    )

    return tmpCanvas
  }

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

              let temp = [...categoryList]
              data.data.getItems.itemList.map(item => {
                temp.push(item.category)
              })
              setCategoryList(temp)
            })
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
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
    setLoading(true)
    if (
      itemNameRef.current.value !== "" &&
      itemPriceRef.current.value !== "" &&
      itemCategoryRef.current.value !== ""
    ) {
      let tempList = [...list]
      tempList.push({
        id: Math.random().toString(36).substr(2, 9).toString(),
        itemName: itemNameRef.current.value,
        itemPrice: itemPriceRef.current.value,
        status: true,
        category: itemCategoryRef.current.value,
        image: imageUrl,
      })
      setList(tempList)
      uploadImage()
      itemNameRef.current.value = ""
      itemPriceRef.current.value = ""
      setImageDetails({ name: "", type: "", image: "" })
      setLoading(false)
    }
    setLoading(false)
  }

  // Reseting the input blocks to empty
  const resetInputHandler = () => {
    itemNameRef.current.value = ""
    itemPriceRef.current.value = ""

    setImageDetails({ name: "", type: "", image: "" })
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
    var removedItem = newList.splice(elementIndex, 1)[0]
    setList(newList)
    resetInputHandler()
  }

  // Adding the chosen items to input
  const updateItemHandler = item => {
    setChosenItem(item)
    console.log(item)
    itemNameRef.current.value = item.itemName
    itemPriceRef.current.value = item.itemPrice
    item.image !== ""
      ? getIndividualImage(item.image)
      : setImageDetails({ name: "", type: "", image: "" })
    setChanging(true)
  }

  // Updating the item finally
  const updateChangeHandler = () => {
    const temp = [...list]
    temp.map(item => {
      if (item.id === chosenItem.id) {
        item.itemName = itemNameRef.current.value
        item.itemPrice = itemPriceRef.current.value
        item.category = itemCategoryRef.current.value
        item.image = imageUrl
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
        console.log(data)
      )
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const selectImage = async e => {
    setLoading(true)
    const selectedFile = e.target.files[0]
    const reader = new FileReader(selectedFile)
    reader.readAsDataURL(selectedFile)
    reader.onload = async () => {
      setImageUrl(reader.result)
      setImageDetails({
        name: selectedFile.name,
        type: selectedFile.type,
        image: "",
      })
    }
    setImageSelector(true)
    setLoading(false)
  }

  const setImage = (previewCanvas, crop) => {
    if (!crop || !previewCanvas) {
      return
    }

    const canvas = getCroppedImg(previewCanvas, crop.width, crop.height)

    let temp = imageDetails
    temp.image = canvas.toDataURL(imageDetails.type)
    setImageDetails(temp)
    setImageUrl(
      `${getCurrentUser()["custom:page_id"]}/items/item${imageDetails.name}`
    )
    setImageSelector(false)
  }

  const uploadImage = async () => {
    setLoading(true)
    try {
      const storeImg = await Storage.put(
        `${getCurrentUser()["custom:page_id"]}/items/item${imageDetails.name}`,
        imageDetails.image,
        {
          level: "public",
          contentType: imageDetails.type,
        }
      )
      if (storeImg) {
        setLoading(false)
        setImageSelector(false)
        console.log(storeImg)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      setImageSelector(false)
    }
  }

  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  return (
    <Layout>
      <Loader loading={loading} />
      {imageSelector && (
        <section className={categoryBasicStyles.imageSelectorContainer}>
          <ReactCrop
            src={imageUrl}
            crop={crop}
            onChange={newCrop => setCrop(newCrop)}
            style={{ marginTop: 44 }}
            ruleOfThirds
            onComplete={c => setCompletedCrop(c)}
            onImageLoaded={onLoad}
            ref={cropRef}
          />
          <div style={{ height: "70vh" }}>
            <canvas
              ref={previewCanvasRef}
              style={{
                width: 1920,
                height: "auto",
                display: "none",
              }}
            />
          </div>
          <section className={categoryBasicStyles.buttonButtomContainer}>
            <button
              onClick={() => {
                setImageUrl("")
                setImageSelector(false)
              }}
              className={categoryBasicStyles.button}
            >
              Cancel
            </button>
            <button
              onClick={() => setImage(previewCanvasRef.current, completedCrop)}
              className={categoryBasicStyles.button}
            >
              OK
            </button>
          </section>
        </section>
      )}
      <section className={categoryBasicStyles.container}>
        <Card>
          <section>
            <h3>{changing ? "Update Item" : "Add Item"}</h3>
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
            <select style={{ width: "90%" }} ref={itemCategoryRef}>
              {categoryList.map((item, id) => (
                <option key={id} value={item}>
                  {item}
                </option>
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
                onClick={list.length > 0 ? uploadData : null}
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

          <section className={categoryBasicStyles.itemControls}>
            <section className={categoryBasicStyles.itemImageContainer}>
              {imageDetails.image !== "" ? (
                <img
                  src={imageDetails.image}
                  ref={itemImageRef}
                  className={categoryBasicStyles.itemImage}
                />
              ) : (
                <section className={categoryBasicStyles.itemImageInstructions}>
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
                      accept="image/*"
                      onChange={e => {
                        selectImage(e)
                      }}
                      hidden
                    />
                    <button type="submit"></button>
                  </form>
                </section>
              )}
            </section>
          </section>
        </Card>

        <section className={categoryBasicStyles.listContainer}>
          {list.map((item, id) => (
            <section className={categoryBasicStyles.greenCard} key={item.id}>
              <section className={categoryBasicStyles.parentDataContainer}>
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
        image
        status
      }
    }
  }
`
