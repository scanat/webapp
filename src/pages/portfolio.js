import Anime from "animejs"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import Banner from "../components/portfolio/banner"
import delivery from "../images/icon/delivery.svg"
import DishesWeek from "../components/portfolio/dishesWeek"
import gallery from "../images/icon/gallery.svg"
import Gallery from "../components/portfolio/gallery"
import info from "../images/icon/info.svg"
import Info from "../components/portfolio/info"
import Layout from "../components/layout"
import livemenu from "../images/icon/livemenu.svg"
import LiveMenu from "../components/menuLayouts/default"
import Logo from "../components/portfolio/logo"
import portfolioStyles from "./portfolio.module.css"
import React, { useState, useEffect, useRef } from "react"
import review from "../images/icon/review.svg"
import Review from "../components/portfolio/review"
import share from "../images/icon/share.svg"
import SocialPage from "../components/portfolio/socialPage"
import SocialPlatform from "../components/portfolio/socialPlatform"
import { getCurrentUser } from "../utils/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faInfo,
  faMapMarkerAlt,
  faShareAlt,
  faStar,
  faAngleDown,
  faSearch,
  faEllipsisH,
  faFilter,
} from "@fortawesome/free-solid-svg-icons"
import {
  faFacebookF,
  faPinterestP,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"
import { Link, navigate } from "gatsby"


Amplify.configure({
  API: {
    aws_appsync_graphqlEndpoint: process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    aws_appsync_region: "ap-south-1",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
  },
})

const Portfolio = ({ location }) => {
  const [shareIconsVisible, setShareIconsVisible] = useState(false)
  const [width, setWidth] = useState()
  const [rated, setRated] = useState(0)
  const [pageData, setPageData] = useState({})
  const [shareShow, setShareShow] = useState(false)
  const [galleryShow, setGalleryShow] = useState(false)
  const [infoShow, setInfoShow] = useState(false)
  const [reviewShow, setReviewShow] = useState(false)
  const [liveMenuShow, setLiveMenuShow] = useState(false)
  const timingPanelRef = useRef(null)
  const backLayoutPanel = useRef(null)
  const [category, setCategory] = useState("")
  const [categoryList, setCategoryList] = useState([])
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const [businessHourStatus, setBusinessHourStatus] = useState("")

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)
    getPageDetails()
    async function getPageDetails() {
      let foundId = new URLSearchParams(location.search).get("id")
      try {
        await API.graphql(
          graphqlOperation(portfolioData, {
            id: foundId,
          })
        ).then(res => {
          setPageData(res.data.getSubscriber)
          if (res.data.getSubscriber.businessHours) {
            let bh = res.data.getSubscriber.businessHours
            console.log(bh)
            if (
              new Date().getDay() > days.indexOf(bh[0].day1) &&
              new Date().getDay() < days.indexOf(bh[0].day2)
            ) {
              if (
                new Date().getHours() > bh[0].time1 &&
                new Date().getHours() < bh[0].time2
              ) {
                let txt = `Open Now - ${bh[0].time1} - ${bh[0].time2} (today)`
                setBusinessHourStatus(txt)
              } else {
                let txt = `Closed Now - ${bh[0].time1} - ${bh[0].time2} (today)`
                setBusinessHourStatus(txt)
              }
            } else {
              let txt = `Closed Now - ${bh[0].time1} - ${bh[0].time2} (today)`
              setBusinessHourStatus(txt)
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
    getCategories()
    async function getCategories() {
      try {
        await API.graphql(
          graphqlOperation(itemsData, {
            id: new URLSearchParams(location.search).get("id"),
          })
        ).then(res => setCategoryList(res.data.getItems.category))
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  const openTiming = () => {
    backLayoutPanel.current.style.display = "block"
    Anime({
      targets: timingPanelRef.current,
      opacity: [0, 1],
      duration: 400,
    }).play()
  }

  const closeBackLayout = () => {
    backLayoutPanel.current.style.display = "none"
    Anime({
      targets: timingPanelRef.current,
      opacity: [1, 0],
      duration: 400,
    }).play()
  }

  return (
    <Layout>
      <section
        className={portfolioStyles.backLayout}
        ref={backLayoutPanel}
        onClick={closeBackLayout}
      ></section>
      <Banner id={new URLSearchParams(location.search).get("id")} />

      <Logo id={new URLSearchParams(location.search).get("id")} />

      <section className={portfolioStyles.orgTitle}>
        <section className={portfolioStyles.orgRate}>
          <FontAwesomeIcon
            icon={faStar}
            color="#ffc400"
            size="xs"
            style={{ margin: "0 2px" }}
          />
          <FontAwesomeIcon
            icon={faStar}
            color="#ffc400"
            size="xs"
            style={{ margin: "0 2px" }}
          />
          <FontAwesomeIcon
            icon={faStar}
            color="#ffc400"
            size="xs"
            style={{ margin: "0 2px" }}
          />
          <FontAwesomeIcon
            icon={faStar}
            color="#ffc400"
            size="xs"
            style={{ margin: "0 2px" }}
          />
          <FontAwesomeIcon
            icon={faStar}
            color="#ffc400"
            size="xs"
            style={{ margin: "0 2px" }}
          />
        </section>
        <h1>{pageData.orgName}</h1>
        {pageData.businessHours && (
          <>
            <label className={portfolioStyles.openTimes} onClick={openTiming}>
              <label>{businessHourStatus}</label>
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{ margin: "0 0 -3px 5px" }}
              />
            </label>
            <section
              ref={timingPanelRef}
              className={portfolioStyles.timingPanel}
            >
              <h5>Business hours</h5>
              <label>
                ({pageData.businessHours[0].day1} -{" "}
                {pageData.businessHours[0].day2}) :{" "}
                {pageData.businessHours[0].time1} -{" "}
                {pageData.businessHours[0].time2}
              </label>
              <br />
              <hr />
              <h5>Happy hours</h5>
              {pageData.businessHours[1].day1 ===
              pageData.businessHours[1].day2 ? (
                <label>
                  ({pageData.businessHours[1].day1} :{" "}
                  {pageData.businessHours[1].time1} -{" "}
                  {pageData.businessHours[1].time2}
                </label>
              ) : (
                <label>
                  ({pageData.businessHours[1].day1} -{" "}
                  {pageData.businessHours[1].day2}) :{" "}
                  {pageData.businessHours[1].time1} -{" "}
                  {pageData.businessHours[1].time2}
                </label>
              )}
            </section>
          </>
        )}
      </section>

      <section className={portfolioStyles.tabs}>
        <ul>
          <li>
            <button>
              <img src={livemenu} color="white" />
              <label>Live</label>
            </button>
          </li>

          <li>
            <button>
              <img src={delivery} />
              <label>Deliver</label>
            </button>
          </li>

          <li>
            <button
              className={reviewShow ? portfolioStyles.active : ""}
              onClick={() => {
                setReviewShow(!reviewShow)
                setInfoShow(false)
                setGalleryShow(false)
                setShareShow(false)
              }}
            >
              <img src={review} />
              <label>Review</label>
            </button>
          </li>

          <li>
            <button
              className={galleryShow ? portfolioStyles.active : ""}
              onClick={() => {
                setGalleryShow(!galleryShow)
                setInfoShow(false)
                setReviewShow(false)
                setShareShow(false)
              }}
            >
              <img src={gallery} />
              <label>Photos</label>
            </button>
          </li>

          <li>
            <button
              className={shareShow ? portfolioStyles.active : ""}
              onClick={() => {
                setShareShow(!shareShow)
                setInfoShow(false)
                setReviewShow(false)
                setGalleryShow(false)
              }}
            >
              <img src={share} />
              <label>Share</label>
            </button>
          </li>

          <li>
            <button
              className={infoShow ? portfolioStyles.active : ""}
              onClick={() => {
                setInfoShow(!infoShow)
                setReviewShow(false)
                setGalleryShow(false)
                setShareShow(false)
              }}
            >
              <img src={info} />
              <label>Info</label>
            </button>
          </li>
        </ul>
      </section>

      {category === "" && categoryList.length > 0 && (
        <section className={portfolioStyles.gridCategory}>
          {categoryList.map((item, index) => (
            <section key={index} onClick={() => setCategory(item)}>
              <img src={require(`../images/icon/${item.toLowerCase()}.svg`)} />
              <label>{item}</label>
            </section>
          ))}
        </section>
      )}

      <LiveMenu
        id={new URLSearchParams(location.search).get("id")}
        table={new URLSearchParams(location.search).get("table")}
        category={category}
      />

      <SocialPlatform
        id={new URLSearchParams(location.search).get("id")}
        show={shareShow}
      />

      <Gallery
        id={new URLSearchParams(location.search).get("id")}
        show={galleryShow}
      />

      <Info
        id={new URLSearchParams(location.search).get("id")}
        show={infoShow}
        address={{
          address1: pageData.address1,
          address2: pageData.address2,
          city: pageData.city,
          state: pageData.state,
          postalCode: pageData.postalCode,
        }}
        phoneNumber={pageData.phoneNumber}
        about={pageData.about}
      />

      <Review
        id={new URLSearchParams(location.search).get("id")}
        show={reviewShow}
        orgName={pageData.orgName}
      />

      {/* <section className={portfolioStyles.liveSpaceContainer}>
        <Link to={`/live?id=${String(location.search).substring(4)}`}>
          <label className={portfolioStyles.menuMainText}>LIVE MENU</label>
        </Link>
      </section> */}

      {/* <SocialPage id={String(location.search).substring(4)} /> */}

      {/* <section className={portfolioStyles.fullDescription}>
        <section className={portfolioStyles.businessLocation}>
          <FontAwesomeIcon icon={faMapMarkerAlt} color="crimson" size="3x" />
          <p className={portfolioStyles.topic}>ADDRESS</p>
          <label className={portfolioStyles.desc}>
            {pageData.address1}
            <br />
            {pageData.address2}
            <br />
            {pageData.city}
            <br />
            {pageData.state}
            <br />
            {pageData.postalCode}
          </label>
        </section>
        <br />

        <section className={portfolioStyles.businessDescription}>
          <FontAwesomeIcon icon={faInfo} color="crimson" size="3x" />
          <p className={portfolioStyles.topic}>About {pageData.orgName}</p>
          <label className={portfolioStyles.desc}>{pageData.about}</label>
        </section>
      </section> */}

      {/* <AmbiencePost id={String(location.search).substring(4)} /> */}

      {/* <DishesWeek id={String(location.search).substring(4)} /> */}

      {/* <section className={portfolioStyles.reviewContainer}>
        <h2 className={portfolioStyles.headerTopic}>Like what you see?</h2>
        <section className={portfolioStyles.reviewHolder}>
          <label className={portfolioStyles.labelTopic}>Rate Us</label>
          <section className={portfolioStyles.starsContainer}>
            <FontAwesomeIcon
              id="rstars"
              icon={faStar}
              color={rated >= 1 ? "#ffd700" : "grey"}
              size="1x"
              onClick={() => setRated(1)}
            />
            <FontAwesomeIcon
              id="rstars"
              icon={faStar}
              color={rated >= 2 ? "#ffd700" : "grey"}
              size="1x"
              onClick={() => setRated(2)}
            />
            <FontAwesomeIcon
              id="rstars"
              icon={faStar}
              color={rated >= 3 ? "#ffd700" : "grey"}
              size="1x"
              onClick={() => setRated(3)}
            />
            <FontAwesomeIcon
              id="rstars"
              icon={faStar}
              color={rated >= 4 ? "#ffd700" : "grey"}
              size="1x"
              onClick={() => setRated(4)}
            />
            <FontAwesomeIcon
              id="rstars"
              icon={faStar}
              color={rated === 5 ? "#ffd700" : "grey"}
              size="1x"
              onClick={() => setRated(5)}
            />
          </section>
          <label className={portfolioStyles.labelTopic}>
            Will you recommend us!
          </label>
          <select>
            <option>Dont think so</option>
            <option>May be</option>
            <option>Surely will</option>
            <option>Highly recommended</option>
          </select>
          <label className={portfolioStyles.labelTopic}>Any Comments!</label>
          <textarea className={portfolioStyles.textAreaInput} />
        </section>
      </section> */}

      {/* <section className={portfolioStyles.bulkOrders}>
        <h2 style={{ margin: "20px 5%", textDecoration: "underline" }}>
          For more
        </h2>
        <input
          placeholder="Phone Number (10)"
          inputMode="tel"
          maxLength="10"
          className={portfolioStyles.input}
        />
        <input
          placeholder="Ocassion"
          inputMode="text"
          className={portfolioStyles.input}
        />
        <textarea
          placeholder="Describe your requirements here, we shall reach you soon..."
          inputMode="text"
          className={portfolioStyles.input}
        />
        <button className={portfolioStyles.button} type="submit">
          Submit
        </button>
      </section> */}
    </Layout>
  )
}

export default Portfolio

export const portfolioData = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      about
      businessHours {
        day1
        day2
        time1
        time2
      }
      address1
      address2
      city
      state
      postalCode
      email
      facebook
      instagram
      orgName
      phoneNumber
      pinterest
      twitter
    }
  }
`
export const itemsData = /* GraphQL */ `
  query GetItems($id: ID!) {
    getItems(id: $id) {
      category
    }
  }
`
