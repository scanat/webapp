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
import { graphql, Link, navigate, navigateTo, useStaticQuery } from "gatsby"
import Select1 from "../images/selects1.jpg"
import Select2 from "../images/selects2.jpg"
import Select3 from "../images/selects3.jpg"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import Anime from 'animejs'

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
  const carouselRef = useRef(null)
  const searchContainerRef = useRef(null)

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(3)
    else if (document.body.offsetWidth < 600) setWidth(4)
    else if (document.body.offsetWidth < 1024) setWidth(6)
    else setWidth(8)
  }, [])

  const searchItems = async () => {
    const params = {
      id: searchRef.current.value,
    }

    try {
      await API.graphql(graphqlOperation(queryOrg, params)).then(res => {
        let list = res.data.listSubscribers.items
        Anime({
          targets: searchContainerRef.current,
          bottom: ['100%', 0],
          duration: 600
        })
        list.map(item => {
          getImage()
          async function getImage() {
            try {
              const paramsImg = {
                Bucket: process.env.GATSBY_S3_BUCKET,
                Key: "public/" + item.logo,
              }
              await subscriberItemS3.getObject(paramsImg, (err, res) => {
                item.imageData = Buffer.from(res.Body, "base64").toString(
                  "ascii"
                )
                setSearchObjectList(list)
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

  return (
    <Layout>
      <section className={exploreStyles.bannerContainer}>
        <BannerCarousel />
      </section>
      <section className={exploreStyles.searchContainer}>
        <section className={exploreStyles.searchBarContainer}>
          <select className={exploreStyles.locationselect}>
            <option>Kolkata</option>
          </select>
          <input
            ref={searchRef}
            placeholder="What are you looking for?"
            className={exploreStyles.searchBar}
          />
          <label className={exploreStyles.gosearch} onClick={searchItems}>
            GO
          </label>
        </section>
      </section>

      <section className={exploreStyles.selectsContainer}>
        <Carousel
          ref={carouselRef}
          itemsToShow={1}
          verticalMode={false}
          showArrows={false}
          pagination={false}
          enableSwipe={true}
          enableAutoPlay={true}
          enableMouseSwipe={true}
          onNextEnd={({ index }) => {
            clearTimeout(2000)
            if (index + 1 === 3) {
              setTimeout(() => {
                carouselRef.current.goTo(0)
              }, 2000)
            }
          }}
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

      <section className={exploreStyles.scanatSelectsContainer}>
        <h1>Scan at selects</h1>
        <label>We bring you the best</label>
        <section className={exploreStyles.selectsContainer}>
          <Carousel
            itemsToShow={width}
            verticalMode={false}
            pagination={false}
            focusOnSelect={true}
            renderArrow={({ type, onClick }) => (
              <FontAwesomeIcon
                onClick={onClick}
                icon={type === "PREV" ? faAngleLeft : faAngleRight}
                size="2x"
                color="grey"
                style={{ margin: "50px 10px 0 10px" }}
              />
            )}
          >
            <section className={exploreStyles.scanatselectsHolder}>
              <img src={Select1} alt="Select 1" />
              <label>Trending this week</label>
            </section>
            <section className={exploreStyles.scanatselectsHolder}>
              <img src={Select2} alt="Select 2" />
              <label>Best offers</label>
            </section>
            <section className={exploreStyles.scanatselectsHolder}>
              <img src={Select3} alt="Select 3" />
              <label>Where friends hangout</label>
            </section>
          </Carousel>
        </section>
      </section>

      <section className={exploreStyles.searchListContainer} ref={searchContainerRef}>
        <section
          style={{
            clear: "both",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <section className={exploreStyles.searchResultContainer}>
            {searchObjectList.map(item => (
              <Link to={`/portfolio/?id=${item.id}`}>
                <section
                  className={exploreStyles.searchItemHolder}
                  key={item.id}
                >
                  <img src={item.imageData} alt={item.image} />
                  <label className={exploreStyles.itemId}>{item.id}</label>
                  <label className={exploreStyles.itemName}>
                    {item.orgName}
                  </label>
                </section>
              </Link>
            ))}
          </section>
        </section>
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
