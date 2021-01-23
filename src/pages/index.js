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
import { Link } from "gatsby"
import Select1 from "../images/selects1.jpg"
import Select2 from "../images/selects2.jpg"
import Select3 from "../images/selects3.jpg"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import Anime from "animejs"
import awsmobile from "../aws-exports"

const amp = Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const subscriberItemS3 = new AWS.S3({
  STORAGE: {
    region: "ap-south-1",
    accessKeyId: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    secretAccessKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const Explore = () => {
  const [width, setWidth] = useState()
  const [searchObjectList, setSearchObjectList] = useState([])
  const searchRef = useRef(null)
  const carouselRef = useRef(null)
  const searchContainerRef = useRef(null)
  const buildingRef = useRef(null)
  const cloudsRef = useRef(null)
  const [result, setResult] = useState("No result")
  const [filtershow, setFiltershow] = useState(false)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    let c = carouselRef.current
    if (document.body.offsetWidth < 400) setWidth(2)
    else if (document.body.offsetWidth < 481) setWidth(3)
    else if (document.body.offsetWidth < 600) setWidth(4)
    else if (document.body.offsetWidth < 1024) setWidth(6)
    else setWidth(8)

    Anime({
      targets: buildingRef.current,
      left: [0, `${document.body.offsetWidth - 900}px`],
      direction: "alternate",
      duration: 30000,
      easing: "linear",
      loop: true,
    })

    Anime({
      targets: cloudsRef.current,
      right: [0, `${document.body.offsetWidth - 1000}px`],
      direction: "alternate",
      duration: 60000,
      easing: "linear",
      loop: true,
    })
  }, [])

  const getGeolocation = () => {
    if (typeof window !== "undefined")
      window.navigator.geolocation.getCurrentPosition(res => setLocation(res))
  }

  const searchListManipulation = dt => {
    dt
      ? Anime({
          targets: searchContainerRef.current,
          bottom: ["-100%", 0],
          duration: 600,
        })
      : Anime({
          targets: searchContainerRef.current,
          bottom: [0, "-100%"],
          duration: 400,
        })
  }

  async function searchItems() {
    let searchString = String(searchRef.current.value).toLowerCase()
    const filter = {
      filter: { orgName: { contains: searchString } },
    }

    try {
      await API.graphql(graphqlOperation(listSubscribers, filter), amp).then(
        res => {
          let list = res.data.listSubscribers.items
          searchListManipulation(true)
          setSearchObjectList(list)
          list.map(item => {
            getImage()
            async function getImage() {
              try {
                const paramsImg = {
                  Bucket: process.env.GATSBY_S3_BUCKET,
                  Key: "public/" + item.logo,
                }
                await subscriberItemS3.getObject(paramsImg, (err, res) => {
                  if (res) {
                    item.imageData = Buffer.from(res.Body, "base64").toString(
                      "ascii"
                    )
                    setSearchObjectList(list)
                  }
                })
              } catch (error) {
                console.log(error)
              }
            }
          })
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      {/* <section className={exploreStyles.bannerContainer}>
        <BannerCarousel />
      </section> */}
      <section
        className={exploreStyles.container}
        style={{ position: "relative" }}
      >
        <section
          className={exploreStyles.filterContainer}
          style={{ display: filtershow ? "flex" : "none" }}
        >
          <label
            style={{
              width: "100%",
              fontSize: "0.6em",
              color: "#169188",
              textAlign: "left",
              margin: "5px",
            }}
          >
            Filter
          </label>
          <section
            style={{
              width: "170px",
              border: "#e1e1e1 1px solid",
              borderRadius: "8px",
              height: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px 0",
            }}
          >
            <label style={{ fontSize: "0.8em", color: "grey", margin: "5px" }}>
              {location ? "Located" : "Enter Location"}
            </label>
            <img
              src={require("../images/icon/geolocation.png")}
              style={{ width: "18px", marginRight: "5px" }}
              onClick={getGeolocation}
            />
          </section>
          <input
            style={{ width: "170px", marginTop: "10px" }}
            type="range"
            min="1"
            max="4"
            step="1"
          />
          <ul
            style={{
              width: "170px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.6em",
              color: "grey",
              marginBottom: "10px",
            }}
          >
            <li>1km</li>
            <li>5km</li>
            <li>10km</li>
            <li>15km</li>
          </ul>
          <select className={exploreStyles.locationselect}>
            <option>Restaurants</option>
            <option>Hotels</option>
          </select>
          <section className={exploreStyles.buttonContainers}>
            <button>Reset</button>
            <button>Apply</button>
          </section>
        </section>
        <img
          ref={buildingRef}
          src={require("../images/homebuilding.png")}
          className={exploreStyles.imagebg}
        />
        <img
          ref={cloudsRef}
          src={require("../images/homeclouds.png")}
          className={exploreStyles.imageclouds}
        />
        {/* <label className={exploreStyles.headerTxt}>Scan At</label> */}
        <section className={exploreStyles.searchContainer}>
          <section className={exploreStyles.searchBarContainer}>
            {/* <select className={exploreStyles.locationselect}>
              <option>Kolkata</option>
            </select> */}
            <section className={exploreStyles.searchHolder}>
              <input
                ref={searchRef}
                placeholder="Search..."
                className={exploreStyles.searchBar}
                onFocus={() => searchListManipulation(false)}
              />
              <button className={exploreStyles.gosearch} onClick={searchItems}>
                <img
                  style={{ width: "15px" }}
                  src={require("../images/icon/search.png")}
                />
              </button>
              <button
                className={exploreStyles.filter}
                onClick={() => setFiltershow(!filtershow)}
              >
                <img
                  style={{ width: "25px" }}
                  src={require("../images/icon/filter.png")}
                />
              </button>
            </section>
          </section>
        </section>

        {/* <section className={exploreStyles.selectsContainer}>
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
                carouselRef.current && carouselRef.current.goTo(0)
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
      </section> */}

        <section
          className={exploreStyles.searchListContainer}
          ref={searchContainerRef}
        >
          <section
            style={{
              clear: "both",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <section className={exploreStyles.searchResultContainer}>
              {searchObjectList.map((item, index) => (
                <Link key={index} to={`/portfolio/?id=${item.id}`}>
                  <section
                    className={exploreStyles.searchItemHolder}
                    key={item.id}
                  >
                    <img src={item.imageData} alt={item.image} />
                    {/* <label className={exploreStyles.itemId}>{item.id}</label> */}
                    <label className={exploreStyles.itemName}>
                      {item.orgName}
                    </label>
                    <p className={exploreStyles.address}>
                      {item.address1} <br /> {item.address2} <br /> {item.city}
                    </p>
                  </section>
                </Link>
              ))}
            </section>
          </section>
        </section>
      </section>
      {filtershow && (
        <section
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
            display: "block",
          }}
          onClick={() => setFiltershow(false)}
        ></section>
      )}
    </Layout>
  )
}

export default Explore

export const listSubscribers = /* GraphQL */ `
  query ListSubscribers($filter: ModelSubscriberFilterInput) {
    listSubscribers(filter: $filter) {
      items {
        id
        address1
        address2
        city
        orgName
        logo
      }
      nextToken
    }
  }
`
