import {
  faFacebookSquare,
  faInstagram,
  faPinterestSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import React, { useEffect, useState } from "react"
import socialPageStyles from "./socialPage.module.css"

Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const SocialPage = props => {
  const [pageData, setPageData] = useState({})

  useEffect(() => {
    getPageDetails()
    async function getPageDetails() {
      try {
        await API.graphql(
          graphqlOperation(socialData, {
            id: props.id,
          })
        ).then(res => {
          setPageData(res.data.getSubscriber)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  return (
    <section className={socialPageStyles.socialLinksContainer}>
      <a href={`https://twitter.com/${pageData.twitter}`} target="blank">
        <FontAwesomeIcon icon={faTwitterSquare} size="lg" color="#00acee" />
      </a>
      <a href={`https://www.facebook.com/${pageData.facebook}`} target="blank">
        <FontAwesomeIcon icon={faFacebookSquare} size="lg" color="#3b5998" />
      </a>
      <a href={`https://pinterest.com/${pageData.pinterest}`} target="blank">
        <FontAwesomeIcon icon={faPinterestSquare} size="lg" color="#e60023" />
      </a>
      <a
        href={`https://www.instagram.com/${pageData.instagram}`}
        target="blank"
      >
        <FontAwesomeIcon icon={faInstagram} size="lg" color="#3f729b" />
      </a>
    </section>
  )
}

export default SocialPage

export const socialData = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      facebook
      instagram
      pinterest
      twitter
    }
  }
`
