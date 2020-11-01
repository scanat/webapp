import React, { useEffect, useState } from "react"
import bannerStyles from "./banner.module.css"
import Img from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"
import AWS from "aws-sdk"
import Amplify, { API, graphqlOperation } from "aws-amplify"

const subscriberPageS3 = new AWS.S3({
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

const Banner = props => {
  const [bannerData, setBannerData] = useState(null)

  const query = useStaticQuery(graphql`
    {
      file {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  useEffect(() => {
    getImage()
  }, [])

  async function getImage() {
    try {
      const imgName = await API.graphql(
        graphqlOperation(getSubscriberBanner, {
          id: props.id,
        })
      )
      const params = {
        Bucket: process.env.GATSBY_S3_BUCKET,
        Key: `public/${
          imgName.data.getSubscriber.banner
        }`,
      }
      await subscriberPageS3.getObject(params, (err, resp) => {
        resp && setBannerData(resp.Body)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={bannerStyles.banner}>
      {bannerData === null ? (
        <Img fluid={query.file.childImageSharp.fluid} />
      ) : (
        <img src={bannerData} alt="Portfolio Banner" />
      )}
    </section>
  )
}
export default Banner

export const getSubscriberBanner = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      banner
    }
  }
`
