import {
  faInstagram,
  faTwitter,
  faFacebookF,
  faPinterestP,
} from "@fortawesome/free-brands-svg-icons"
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { API, graphqlOperation } from "aws-amplify"
import React, { useEffect, useRef } from "react"
import { getCurrentUser } from "../../utils/auth"
import socialPlatformStyles from "./socialPlatform.module.css"

const SocialPlatform = props => {
  const twitterRef = useRef("")
  const facebookRef = useRef("")
  const pinterestRef = useRef("")
  const instagramRef = useRef("")

  useEffect(() => {
    twitterRef.current.value = props.details.twitter
    facebookRef.current.value = props.details.facebook
    pinterestRef.current.value = props.details.pinterest
    instagramRef.current.value = props.details.instagram
  }, [props.details])

  const setTwitter = async () => {
    try {
      
      const subData = await API.graphql(
        graphqlOperation(updateSubscriberSocialPlatform, {
          input: {
            id: getCurrentUser()["custom:page_id"],
            twitter: twitterRef.current.value,
          },
        })
      )
      console.log(subData)
    } catch (error) {
      console.log(error)
    }
  }

  const setFacebook = async () => {
    try {
      const subData = await API.graphql(
        graphqlOperation(updateSubscriberSocialPlatform, {
          input: {
            id: getCurrentUser()["custom:page_id"],
            facebook: facebookRef.current.value,
          },
        })
      )
      console.log(subData)
    } catch (error) {
      console.log(error)
    }
  }

  const setPinterest = async () => {
    try {
      const subData = await API.graphql(
        graphqlOperation(updateSubscriberSocialPlatform, {
          input: {
            id: getCurrentUser()["custom:page_id"],
            pinterest: pinterestRef.current.value,
          },
        })
      )
      console.log(subData)
    } catch (error) {
      console.log(error)
    }
  }

  const setInstagram = async () => {
    try {
      const subData = await API.graphql(
        graphqlOperation(updateSubscriberSocialPlatform, {
          input: {
            id: getCurrentUser()["custom:page_id"],
            instagram: instagramRef.current.value,
          },
        })
      )
      console.log(subData)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={socialPlatformStyles.socialLinksContainer}>
      <p className={socialPlatformStyles.headerTopic}>
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
      </section>
    </section>
  )
}

export default SocialPlatform

export const updateSubscriberSocialPlatform = /*GraphQL*/`
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      twitter
      facebook
      pinterest
      instagram
    }
  }
`
