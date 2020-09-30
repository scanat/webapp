import React, { useState, useEffect, useRef } from "react"
import Layout from "../components/layout"
import exploreStyles from "./explore.module.css"
import BannerCarousel from "../components/explore/bannerCarousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSearch,
  faAngleLeft,
  faAngleRight,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons"
import Carousel from "react-elastic-carousel"
import AWS from 'aws-sdk'

const subscriberPageS3 = new AWS.S3({
  region: "ap-south-1",
  apiVersion: "2006-03-01",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_SECRET_ACCESS_KEY,
})

const subscriberPageDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
  apiVersion: "2012-08-10",
  accessKeyId: process.env.GATSBY_SUBSCRIBERPAGE_DB_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_SUBSCRIBERPAGE_DB_SECRET_ACCESS_KEY,
})

const Explore = () => {
  const [width, setWidth] = useState()
  const searchRef = useRef(null)

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)
  }, [])

  const searchItems = async () => {
    const params = {
      TableName: "subscriberPage",
      ExpressionAttributeNames: {
        "#PID": "pageId",
      },
      ExpressionAttributeValues: {
        ":i": searchRef.current.value,
      },
    }

    await subscriberPageDb.scan(params, (err, data) => {
        console.log(err, data)
    })
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
            placeholder="Search..."
            className={exploreStyles.searchBar}
          />
          <FontAwesomeIcon
            icon={faSearch}
            color="grey"
            className={exploreStyles.searchIcon}
            onClick={searchItems}
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
          <section className={exploreStyles.selectsHolder}></section>
          <section className={exploreStyles.selectsHolder}></section>
          <section className={exploreStyles.selectsHolder}></section>
        </Carousel>
      </section>

      <section className={exploreStyles.searchResultContainer}></section>
    </Layout>
  )
}

export default Explore
