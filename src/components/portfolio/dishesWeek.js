import React, { useState, useEffect } from "react"
import dishStyles from "./dishesWeek.module.css"
import Amplify from "aws-amplify"
import AWS from "aws-sdk"

const subscriberDishesS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const DishesWeek = props => {
  const [itemList, setItemList] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  // Fetch inital data if available
  const fetchData = async () => {
    try {
      const paramsJson = {
        Bucket: process.env.GATSBY_S3_BUCKET,
        Key: `public/${props.id}/dishes.json`,
      }
      await subscriberDishesS3.getObject(paramsJson, (err, res) => {
        if (res) {
          let resJson = new TextDecoder("utf-8").decode(res.Body)
          resJson = JSON.parse(resJson)
          resJson.dishes.tempList.pop()
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

  return (
    <section className={dishStyles.container}>
      <h2 className={dishStyles.headerTopic}>dishes of the week</h2>
      {itemList.map(item => (
        <section className={dishStyles.dishesContainer} key={item.id}>
          <img
            src={item.imageData}
            alt="Scan At Dish Image"
            className={dishStyles.dishesImage}
          />
          <section>
            <h4 className={dishStyles.dishName}>{item.itemName}</h4>
            <p className={dishStyles.dishDescription}>{item.itemDesc}</p>
            <p className={dishStyles.offerprice}>
              <strike className={dishStyles.strokePrice}>Rs. {item.itemPrice}</strike>{" "}
              Rs. 840/-{" "}
              <label className={dishStyles.offerOff}>(20% OFF)</label>
            </p>
          </section>
        </section>
      ))}
    </section>
  )
}

export default DishesWeek