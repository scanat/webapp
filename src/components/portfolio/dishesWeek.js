import React, { useState, useEffect } from "react"
import dishStyles from "./dishesWeek.module.css"
import { faWindowClose } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify"
import { getCurrentUser } from "../../utils/auth"
import AWS from "aws-sdk"
import awsmobile from "../../aws-exports"

const subscriberDishesS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

Amplify.configure(awsmobile)

const DishesWeek = () => {
  const [itemList, setItemList] = useState([])
  const [fetchList, setFetchList] = useState([])
  const [dishesJson, setDishesJson] = useState({ dishes: {} })

  useEffect(() => {
    itemList.push({ image: "", price: "", itemName: "" })
    fetchData()
  }, [])

  // Fetch inital data if available
  const fetchData = async () => {
    try {
      const params = {
        id: getCurrentUser()["custom:page_id"],
      }
      await API.graphql(graphqlOperation(getItems, params)).then(res =>
        setFetchList(res.data.getItems.itemList)
      )
      const paramsJson = {
        Bucket: awsmobile.aws_user_files_s3_bucket,
        Key: `public/${getCurrentUser()["custom:page_id"]}/dishes.json`,
      }
      await subscriberDishesS3.getObject(paramsJson, (err, res) => {
        if (res) {
          let resJson = new TextDecoder("utf-8").decode(res.Body)
          resJson = JSON.parse(resJson)
          if (resJson.dishes.tempList) {
            resJson.dishes.tempList.map(item => {
              if (item.imageData) {
                let temp = Buffer.from(item.imageData.data, "base64").toString(
                  "ascii"
                )
                item.imageData = temp
              }
            })
            setItemList(resJson.dishes.tempList)
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Add Item to Item List
  const addItem = async e => {
    fetchList.forEach(element => {
      if (element.itemName === e.target.value) {
        getImg()
        async function getImg() {
          try {
            const params = {
              Bucket: awsmobile.aws_user_files_s3_bucket,
              Key: `public/${element.image}`,
            }
            await subscriberDishesS3.getObject(params, (err, resp) => {
              let tempList = [...itemList]
              element.imageData = resp.Body
              tempList.unshift(element)
              setItemList(tempList)
              setDishesJson({ dishes: { tempList } })
            })
          } catch (error) {
            console.log(error)
            return ""
          }
        }
      }
    })
  }
  // Offer and Price Handlers
  const newItemPriceHandler = (e, id) => {
    let tempList = [...itemList]
    tempList[id].offerPrice = e
    tempList[id].offerValue = ((1 - e / tempList[id].itemPrice) * 100).toFixed(
      2
    )
    setItemList(tempList)
  }

  const newOfferValueHandler = async (e, id) => {
    let tempList = [...itemList]
    tempList[id].offerValue = e
    tempList[id].offerPrice = (
      tempList[id].itemPrice -
      (e / 100) * tempList[id].itemPrice
    ).toFixed(2)
    setItemList(tempList)
  }

  const uploadDishes = async () => {
    try {
      await Storage.put(
        `${getCurrentUser()["custom:page_id"]}/dishes.json`,
        dishesJson,
        { level: "public", contentType: "application/json" }
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={dishStyles.container}>
      <h2 className={dishStyles.headerTopic}>dishes of the week</h2>
      {itemList.map((item, id) => (
        <section className={dishStyles.dishesContainer} key={id}>
          <FontAwesomeIcon
            className={dishStyles.closeTopRight}
            icon={faWindowClose}
            size="lg"
            color="whitesmoke"
          />
          <section className={dishStyles.dishesImage}>
            {item.image !== "" ? (
              <img
                src={item.imageData.data ? item.imageData.data : item.imageData}
                alt={id}
                className={dishStyles.ambienceImage}
              />
            ) : (
              <section className={dishStyles.ambienceInstructions}>
                <label
                  className={dishStyles.smallDesc}
                  style={{ color: "whitesmoke" }}
                >
                  Select your offered item
                </label>
                <select
                  className={dishStyles.fetchedItemsOptions}
                  onChange={addItem}
                >
                  <option key={-1}>Items</option>
                  {fetchList.map((item, fid) => (
                    <option key={fid}>{item.itemName}</option>
                  ))}
                </select>
              </section>
            )}
          </section>
          <section style={{ textAlign: "center" }}>
            <h4 className={dishStyles.dishName}>
              {item.status ? item.itemName : "Dish Name"}
            </h4>
            <textarea
              className={dishStyles.textAreaInput}
              style={{ width: "250px", height: "40px" }}
              placeholder="This is a little description of the item that has been newly added
            here."
            >
              {item.status && item.itemDesc}
            </textarea>
            <p className={dishStyles.offerprice}>
              <strike className={dishStyles.strokePrice}>
                Rs. {item.status ? item.itemPrice : 1000}
              </strike>{" "}
              Rs.{" "}
              <input
                className={dishStyles.textAreaInput}
                style={{ maxWidth: "40px" }}
                placeholder="800"
                inputMode="tel"
                onChange={e => newItemPriceHandler(e.target.value, id)}
              />{" "}
              /- <br />
              <label className={dishStyles.offerOff}>
                (
                <input
                  className={dishStyles.textAreaInput}
                  style={{ maxWidth: "30px" }}
                  placeholder="20"
                  inputMode="tel"
                  onChange={e => newOfferValueHandler(e.target.value, id)}
                  value={item.offerValue}
                  disabled
                />{" "}
                % OFF)
              </label>
            </p>
          </section>
        </section>
      ))}

      <button
        className={dishStyles.button}
        onClick={uploadDishes}
        type="button"
      >
        Save weekly dishes
      </button>
    </section>
  )
}

export default DishesWeek

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
