import React, { useState, useEffect, useRef } from "react"
import Layout from "../components/layout"
import exploreStyles from "./index.module.css"
import BannerCarousel from "../components/bannerCarousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSearch,
  faAngleLeft,
  faAngleRight,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons"
import Carousel from "react-elastic-carousel"
import AWS from "aws-sdk"
import Img from "gatsby-image"
import { graphql, navigate, useStaticQuery } from "gatsby"
import Select1 from "../images/selects1.jpg"
import Select2 from "../images/selects2.jpg"
import Select3 from "../images/selects3.jpg"
import Amplify, { API, graphqlOperation } from "aws-amplify"

Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const subscriberItemS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

const Explore = () => {
  const [width, setWidth] = useState()
  const [searchObjectList, setSearchObjectList] = useState([])
  const searchRef = useRef(null)

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)
  }, [])

  const searchItems = async () => {
    let empty = []
    setSearchObjectList(empty)
    const params = {
      id: searchRef.current.value,
    }

    try {
      await API.graphql(graphqlOperation(queryOrg, params)).then(res => {
        res.data.listSubscribers.items.map(item => {
          getImage()
          async function getImage() {
            try {
              const paramsImg = {
                Bucket: process.env.GATSBY_S3_BUCKET,
                Key: "public/" + item.logo,
              }
              await subscriberItemS3.getObject(paramsImg, (err, res) => {
                item.imageData = Buffer.from(res.Body, "base64").toString("ascii")
                let temp = [...searchObjectList]
                temp.push(item)
                setSearchObjectList(temp)
              })
            } catch (error) {
              console.log(error)
            }
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function getItemImage(image) {
    try {
      const paramsImg = {
        Bucket: process.env.GATSBY_S3_BUCKET,
        Key: "public/" + image,
      }

      await subscriberItemS3.getObject(paramsImg, (err, resp) => {
        console.log(
          "s3://scanatsubscriber620f032716d7410c9e97e968f28666314831-dev/public/" +
            image
        )
        return btoa(resp.Body)
      })
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return (
    <Layout>
      <section className={exploreStyles.bannerContainer}>
        <BannerCarousel />
      </section>
      <section className={exploreStyles.searchContainer}>
        <section className={exploreStyles.searchBarContainer}>
          <input
            ref={searchRef}
            placeholder="Search page..."
            className={exploreStyles.searchBar}
          />
          <FontAwesomeIcon
            icon={faSearch}
            color="grey"
            size="lg"
            className={exploreStyles.searchIcon}
            onClick={() => {
              searchItems()
            }}
          />
        </section>
      </section>

      <section className={exploreStyles.selectsContainer}>
        <Carousel
          itemsToShow={width}
          verticalMode={false}
          pagination={true}
          renderPagination={() => (
            <FontAwesomeIcon icon={faEllipsisH} size="lg" color="grey" />
          )}
          focusOnSelect={true}
          renderArrow={({ type, onClick }) => (
            <FontAwesomeIcon
              onClick={onClick}
              icon={type === "PREV" ? faAngleLeft : faAngleRight}
              size="2x"
              color="grey"
              style={{ marginTop: "50px" }}
            />
          )}
        >
          <section className={exploreStyles.selectsHolder}>
            <img src={Select1} alt="Select 1" />
          </section>
          <section className={exploreStyles.selectsHolder}>
            <img src={Select2} alt="Select 2" />
          </section>
          <section className={exploreStyles.selectsHolder}>
            <img src={Select3} alt="Select 3" />
          </section>
        </Carousel>
      </section>

      <section className={exploreStyles.searchResultContainer}>
        {searchObjectList.map(item => (
          <section
            className={exploreStyles.searchItemHolder}
            onClick={navigate('/profile')}
            key={item.id}
          >
            <img
              src={item.imageData}
              alt={item.image}
            />
            <label className={exploreStyles.itemId}>{item.id}</label>
            <label className={exploreStyles.itemName}>{item.orgName}</label>
          </section>
        ))}
      </section>
    </Layout>
  )
}

export default Explore

export const queryOrg = /*GraphQL*/ `
  query subscriber($id: String!) {
    listSubscribers(
      filter: { orgName: { contains: $id } }
    ) {
      items {
        logo
        orgName
        id
      }
    }
  }
`
