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
  const [searchObjectList, setSearchObjectList] = useState([])
  const searchRef = useRef(null)

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)
  }, [])

  const searchItems = async () => {
    setSearchObjectList([])
    console.log(searchObjectList)
    const params = {
      TableName: "subscriberPage",
      AttributesToGet: ["pageId", "portfolioLogo"],
      ScanFilter: {
        pageId: {
          ComparisonOperator: "CONTAINS",
          AttributeValueList: [searchRef.current.value],
        },
      },
    }

    await subscriberPageDb.scan(params, (err, data) => {
      if (data) {
        const itemList = data.Items
        itemList.map((element, id) => {
          if (!element.portfolioLogo) {
            element.image = ""
            searchObjectList.push(element)
            let tempList = [...searchObjectList]
            setSearchObjectList(tempList)
          } else {
            getItemImages(element, id)
          }
        })
      }
    })
  }

  async function getItemImages(element, id) {
    const params = {
      Bucket: "subscriber-media",
      Key: `Portfolio/${element.pageId}/${element.portfolioLogo}`,
    }
    await subscriberPageS3.getObject(params, (err, data) => {
      element.image = data.Body
      searchObjectList.push(element)
      let tempList = [...searchObjectList]
      setSearchObjectList(tempList)
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
            placeholder="Search page..."
            className={exploreStyles.searchBar}
          />
          <FontAwesomeIcon
            icon={faSearch}
            color="grey"
            size="lg"
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
        {searchObjectList !== null &&
          searchObjectList.map((item, id) => (
            <section
              className={exploreStyles.searchItemHolder}
              onClick={() => navigate(`/portfolio?org=${item.pageId}`)}
            >
              <img src={item.image} alt={item.image} />
              <label>{item.pageId}</label>
            </section>
          ))}
      </section>
    </Layout>
  )
}

export default Explore
