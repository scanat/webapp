import Amplify, { API, graphqlOperation } from "aws-amplify"
import React, { useState, useEffect } from "react"
import AWS from "aws-sdk"
import awsmobile from "../../aws-exports"
import logoStyles from "./logo.module.css"

const subscriberLogoS3 = new AWS.S3({
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

const Logo = props => {
  const [logoData, setLogoData] = useState(null)

  useEffect(() => {
    getImage()
  }, [])

  async function getImage() {
    try {
      const imgName = await API.graphql(
        graphqlOperation(getSubscriberLogo, {
          id: props.id,
        })
      )
      const params = {
        Bucket: process.env.GATSBY_S3_BUCKET,
        Key: `public/${imgName.data.getSubscriber.logo}`,
      }
      await subscriberLogoS3.getObject(params, (err, resp) => {
        resp && setLogoData(resp.Body)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={logoStyles.logoContainer}>
      {logoData === null ? (
        <label className={logoStyles.logoText}>
          {props.id && props.id.substring(0, 2)}
        </label>
      ) : (
        <img src={logoData} alt="Logo" />
      )}
    </section>
  )
}

export default Logo

export const getSubscriberLogo = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      logo
    }
  }
`
