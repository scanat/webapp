import React, { useState, useEffect, useRef } from "react"
import Layout from "../components/layout"
import portfolioStyles from "./portfolio.module.css"
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
import Logo from "../components/portfolio/logo"
import Banner from "../components/portfolio/banner"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import SocialPage from "../components/portfolio/socialPage"
import SocialPlatform from "../components/portfolio/socialPlatform"
import Gallery from "../components/portfolio/gallery"
import DishesWeek from "../components/portfolio/dishesWeek"
import { Link, navigate } from "gatsby"
import Anime from "animejs"
import LiveMenu from "../components/menuLayouts/default"
import Info from "../components/portfolio/info"

import gallery from "../images/icon/gallery.svg"
import delivery from "../images/icon/delivery.svg"
import livemenu from "../images/icon/livemenu.svg"
import review from "../images/icon/review.svg"
import share from "../images/icon/share.svg"
import info from "../images/icon/info.svg"
import Review from "../components/portfolio/review"

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
  const timingPanelRef = useRef(null)
  const backLayoutPanel = useRef(null)

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)
    getPageDetails()
    async function getPageDetails() {
      let foundId = String(location.search).substring(4)
      try {
        await API.graphql(
          graphqlOperation(portfolioData, {
            id: foundId,
          })
        ).then(res => {
          setPageData(res.data.getSubscriber)
        })
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
      <Banner id={String(location.search).substring(4)} />

      <Logo id={String(location.search).substring(4)} />

      {/* <ul className={portfolioStyles.shareListContainer}>
        <li onClick={() => setShareIconsVisible(!shareIconsVisible)}>
          <FontAwesomeIcon
            icon={faShareAlt}
            color={shareIconsVisible ? "#169188" : "grey"}
            size="lg"
          />
          <ul
            className={portfolioStyles.shareSubListContainer}
            style={{ display: shareIconsVisible ? "block" : "none" }}
          >
            <li>
              <a
                alt="Whatsapp"
                href={`https://wa.me/?text=Here is my portfolio, please visit and help me share more! https://scanat.in/portfolio${
                  getCurrentUser().website
                }`}
                className={portfolioStyles.shareLink}
              >
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </a>
            </li>
            <li>
              <a
                alt="Twitter"
                href={`https://twitter.com/share?text=Here is my portfolio, please visit and help me share more!&url=https://scanat.in/portfolio${
                  getCurrentUser().website
                }`}
                className={portfolioStyles.shareLink}
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
            </li>
            <li>
              <a
                alt="Facebook"
                href={`https://facebook.com/sharer.php?u=https%3A%2F%2Fscanat.in/portfolio${
                  getCurrentUser().website
                }[title]=Here+is+my+portfolio,+please+visit+and+help+me+share+more!`}
                className={portfolioStyles.shareLink}
              >
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
            </li>
            <li>
              <a
                alt="Pinterest"
                href={`http://pinterest.com/pin/create/button/?url=${
                  getCurrentUser().website
                }&description=Here+is+my+portfolio,+please+visit+and+help+me+share+more!`}
                className={portfolioStyles.shareLink}
              >
                <FontAwesomeIcon icon={faPinterestP} size="lg" />
              </a>
            </li>
          </ul>
        </li>
      </ul> */}

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
        <label className={portfolioStyles.openTimes} onClick={openTiming}>
          <label>Open now</label> - 10am - 11pm (today)
          <FontAwesomeIcon
            icon={faAngleDown}
            style={{ margin: "0 0 -3px 5px" }}
          />
        </label>
        <section ref={timingPanelRef} className={portfolioStyles.timingPanel}>
          <label>(Mon - Sun) : 10am - 11pm</label>
          <br />
          <hr />
          <h5>Happy hours</h5>
          <label>(Mon and Fri) : 4pm - 7pm</label>
        </section>
      </section>

      <section className={portfolioStyles.tabs}>
        <ul>
          <li>
            <img src={livemenu} color="white" />
            <label>Live</label>
          </li>

          <li>
            <img src={delivery} />
            <label>Delivery</label>
          </li>

          <li
            onClick={() => {
              setReviewShow(!reviewShow)
              setInfoShow(false)
              setGalleryShow(false)
              setShareShow(false)
            }}
          >
            <img src={review} />
            <label>Review</label>
          </li>

          <li
            onClick={() => {
              setGalleryShow(!galleryShow)
              setInfoShow(false)
              setReviewShow(false)
              setShareShow(false)
            }}
          >
            <img src={gallery} />
            <label>Photos</label>
          </li>

          <li
            onClick={() => {
              setShareShow(!shareShow)
              setInfoShow(false)
              setReviewShow(false)
              setGalleryShow(false)
            }}
          >
            <img src={share} />
            <label>Share</label>
          </li>

          <li
            onClick={() => {
              setInfoShow(!infoShow)
              setReviewShow(false)
              setGalleryShow(false)
              setShareShow(false)
            }}
          >
            <img src={info} />
            <label>Info</label>
          </li>
        </ul>
      </section>

      <LiveMenu
        id={new URLSearchParams(location.search).get("id")}
        table={new URLSearchParams(location.search).get("table")}
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
      address1
      address2
      city
      state
      postalCode
      category
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
