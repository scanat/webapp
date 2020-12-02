import {
  faInstagram,
  faTwitter,
  faFacebookF,
  faPinterestP,
} from "@fortawesome/free-brands-svg-icons"
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import React, { createElement, useEffect, useRef, useState } from "react"
import { getCurrentUser } from "../../utils/auth"
import socialPlatformStyles from "./socialPlatform.module.css"
import Anime from "animejs"
import { CopyToClipboard } from "react-copy-to-clipboard"

Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const SocialPlatform = props => {
  const [twitter, setTwitter] = useState("")
  const [facebook, setFacebook] = useState("")
  const [pinterest, setPinterest] = useState("")
  const [instagram, setInstagram] = useState("")
  const containerRef = useRef(null)
  const copiedTextRef = useRef(null)

  useEffect(() => {
    props.show
      ? Anime({
          targets: containerRef.current,
          bottom: ["-60px", 0],
          easing: "linear",
          duration: 200,
        }).play()
      : Anime({
          targets: containerRef.current,
          bottom: [0, "-60px"],
          easing: "linear",
          duration: 200,
        }).play()
  }, [props.show])

  useEffect(() => {
    getSocialData()
    async function getSocialData() {
      try {
        await API.graphql(graphqlOperation(socialData, { id: props.id })).then(
          res => {
            setTwitter(res.data.getSubscriber.twitter)
            setFacebook(res.data.getSubscriber.facebook)
            setPinterest(res.data.getSubscriber.pinterest)
            setInstagram(res.data.getSubscriber.instagram)
          }
        )
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  const copiedShow = () => {
    Anime({
      targets: copiedTextRef.current,
      opacity: [0, 1],
      duration: 500,
      direction: 'alternate',
    }).play()
  }

  return (
    <section
      ref={containerRef}
      className={socialPlatformStyles.socialLinksContainer}
    >
      <ul>
        <li>
          <a href={`https://www.twitter.com/${twitter}`} target="blank">
            <FontAwesomeIcon icon={faTwitter} size="lg" color="black" />
          </a>
        </li>
        <li>
          <a href={`https://www.facebook.com/${facebook}`} target="blank">
            <FontAwesomeIcon icon={faFacebookF} size="lg" color="black" />
          </a>
        </li>
        <li>
          <a href={`https://www.pinterest.com/${pinterest}`} target="blank">
            <FontAwesomeIcon icon={faPinterestP} size="lg" color="black" />
          </a>
        </li>
        <li>
          <a href={`https://www.instagram.com/${instagram}`} target="blank">
            <FontAwesomeIcon icon={faInstagram} size="lg" color="black" />
          </a>
        </li>
        <li>
          <span ref={copiedTextRef}>Copied!</span>
          <CopyToClipboard
            text={`https://www.scanat.in/portfolio/?id=${props.id}`}
          >
            <FontAwesomeIcon
              icon={faLink}
              size="lg"
              color="black"
              onClick={copiedShow}
            />
          </CopyToClipboard>
        </li>
      </ul>
      {/* <p className={socialPlatformStyles.headerTopic}>
        {" "}
        Bring folowers to your social media pages
      </p>
      <section className={socialPlatformStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faTwitter} size="lg" color="#00acee" />
        <input
          className={socialPlatformStyles.socialTextInput}
          placeholder="Your Twitter ID"
          ref={twitterRef}
          name="TwitterId"
          value={props.details && props.twitter}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          onClick={() => setTwitter(twitterRef)}
          size="lg"
          color="#169188"
        />
      </section>
      <section className={socialPlatformStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faFacebookF} size="lg" color="#3b5998" />
        <input
          className={socialPlatformStyles.socialTextInput}
          placeholder="Your Facebook Page"
          ref={facebookRef}
          name="FacebookId"
          value={props.facebook && props.facebook}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          onClick={() => setFacebook(facebookRef)}
          size="lg"
          color="#169188"
        />
      </section>
      <section className={socialPlatformStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faPinterestP} size="lg" color="#e60023" />
        <input
          className={socialPlatformStyles.socialTextInput}
          placeholder="Your Pinterest ID"
          ref={pinterestRef}
          name="PinterestId"
          value={props.pinterest && props.pinterest}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          onClick={() => setPinterest(pinterestRef)}
          size="lg"
          color="#169188"
        />
      </section>
      <section className={socialPlatformStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faInstagram} size="lg" color="#3f729b" />
        <input
          className={socialPlatformStyles.socialTextInput}
          placeholder="Your Instagram ID"
          ref={instagramRef}
          name="InstagramId"
          value={props.instagram && props.instagram}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          onClick={() => setInstagram(instagramRef)}
          size="lg"
          color="#169188"
        />
      </section> */}
    </section>
  )
}

export default SocialPlatform

export const updateSubscriberSocialPlatform = /*GraphQL*/ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      twitter
      facebook
      pinterest
      instagram
    }
  }
`

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
