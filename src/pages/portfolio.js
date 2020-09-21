import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import portfolioStyles from "./portfolio.module.css"
import PortfolioBanner from "../images/portfolio-banner.jpg"
import { getCurrentUser } from "../utils/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faEllipsisH,
  faEllipsisV,
  faHeart,
} from "@fortawesome/free-solid-svg-icons"
import Carousel from "react-elastic-carousel"
import {
  faFacebookF,
  faPinterestP,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"
import { Link, navigate } from "gatsby"
import Loader from "../components/loader"

const CardLayout = props => {
  return (
    <section className={portfolioStyles.cardContainer}>
      <img
        src={props.image}
        alt={props.image}
        className={portfolioStyles.image}
      />
      <label className={portfolioStyles.hearts}>
        {props.hearts}
        <FontAwesomeIcon icon={faHeart} color="crimson" />
      </label>
    </section>
  )
}

const Portfolio = () => {
  const [subMenu, setSubMenu] = useState(false)

  const toggleSubmenu = () => {
    subMenu ? setSubMenu(false) : setSubMenu(true)
  }

  return Object.keys(getCurrentUser()).length === 0 ? (
    <Layout>
      <h1
        style={{
          color: "crimson",
          fontSize: "16px",
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        Oops seems like you are not logged in yet!
      </h1>
      <label className={portfolioStyles.link}>
        You can login using [ <FontAwesomeIcon icon={faEllipsisV} size="lg" /> ]
        on the top right corner
      </label>
      <br />
      OR
      <br />
      <Link to="/" style={{ margin: "0 auto" }}>
        <label className={portfolioStyles.link}>Reach Home</label>
      </Link>
    </Layout>
  ) : (
    <Layout>
      <section className={portfolioStyles.banner}>
        <img src={PortfolioBanner} alt="Portfolio Banner" />
      </section>

      <section className={portfolioStyles.logoContainer}>
        <label className={portfolioStyles.logoText}>
          {getCurrentUser().name.substring(0, 2)}
        </label>
      </section>

      <section className={portfolioStyles.liveSpaceContainer}>
        <label className={portfolioStyles.liveSpaceText}>
          Live Accomodation{" "}
          <label className={portfolioStyles.liveSpaceNumber}>02</label>
        </label>
        <br />
        <section className={portfolioStyles.liveMenuContainer}>
          <a href={`https://www.scanat.in${getCurrentUser().website}`}>
            <label className={portfolioStyles.menuMainText}>LIVE MENU</label>
          </a>
          <ul className={portfolioStyles.menu}>
            <li id="dropDownParent" onTouchStart={toggleSubmenu}>
              <FontAwesomeIcon
                icon={faAngleDown}
                color="#169188"
                size="lg"
                style={{ margin: "0 0 -3px 20px" }}
              />
              <ul
                className={portfolioStyles.subMenu}
                style={{ display: subMenu ? "block" : "none" }}
              >
                <li>Delivery</li>
                <li>Dine In</li>
                <li>Take-Away</li>
              </ul>
            </li>
          </ul>
        </section>
      </section>

      <section className={portfolioStyles.socialLinksContainer}>
        <a
          alt="Whatsapp"
          href={`https://wa.me/?text=Here is my portfolio, please visit and help me share more! https://scanat.in/portfolio${
            getCurrentUser().website
          }`}
          class={portfolioStyles.shareLink}
        >
          <FontAwesomeIcon icon={faWhatsapp} size="lg" />
          <br />
          <label className={portfolioStyles.shareText}>WhatsApp</label>
        </a>

        <a
          alt="Twitter"
          href={`https://twitter.com/share?text=Here is my portfolio, please visit and help me share more!&url=https://scanat.in/portfolio${
            getCurrentUser().website
          }`}
          class={portfolioStyles.shareLink}
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" />
          <br />
          <label className={portfolioStyles.shareText}>Twitter</label>
        </a>

        <a
          alt="Facebook"
          href={`https://facebook.com/sharer.php?u=https%3A%2F%2Fscanat.in/portfolio${
            getCurrentUser().website
          }[title]=Here+is+my+portfolio,+please+visit+and+help+me+share+more!`}
          class={portfolioStyles.shareLink}
        >
          <FontAwesomeIcon icon={faFacebookF} size="lg" />
          <br />
          <label className={portfolioStyles.shareText}>Facebook</label>
        </a>

        <a
          alt="Pinterest"
          href={`http://pinterest.com/pin/create/button/?url=${
            getCurrentUser().website
          }&description=Here+is+my+portfolio,+please+visit+and+help+me+share+more!`}
          class={portfolioStyles.shareLink}
        >
          <FontAwesomeIcon icon={faPinterestP} size="lg" />
          <br />
          <label className={portfolioStyles.shareText}>Pinterest</label>
        </a>
      </section>

      <section className={portfolioStyles.fullDescription}>
        <section className={portfolioStyles.businessLocation}>
          <h2 className={portfolioStyles.topic}>Located At</h2>
          <p className={portfolioStyles.desc}>
            {getCurrentUser()["custom:address_line_1"] +
              ", " +
              getCurrentUser()["custom:address_line_2"] +
              ", " +
              getCurrentUser()["custom:city"] +
              ", " +
              getCurrentUser()["custom:state"]}
          </p>
        </section>

        <section className={portfolioStyles.businessDescription}>
          <h2 className={portfolioStyles.topic}>
            About {getCurrentUser().name}
          </h2>
          <p className={portfolioStyles.desc}>
            {getCurrentUser()["custom:category"]}
          </p>
        </section>
      </section>

      <section className={portfolioStyles.ourDealsContainer}>
        <h2 className={portfolioStyles.headerTopic}>our top deals</h2>
        <section className={portfolioStyles.ourDeals}>
          <Carousel
            itemsToShow={2}
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
            {topDeals.map((element, index) => (
              <CardLayout
                key={index}
                image={element.image}
                hearts={element.hearts}
              />
            ))}
          </Carousel>
        </section>
      </section>

      <section className={portfolioStyles.bulkOrders}>
        <h2 style={{ margin: "20px 5%", textDecoration: "underline" }}>
          For Bulk Orders and Ocassions
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
      </section>
    </Layout>
  )
}

export default Portfolio

let topDeals = [
  {
    image:
      "https://cdn.pixabay.com/photo/2010/12/13/10/05/background-2277_640.jpg",
    hearts: 100,
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2010/12/13/10/05/background-2277_640.jpg",
    hearts: 58,
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2010/12/13/10/05/background-2277_640.jpg",
    hearts: 70,
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2010/12/13/10/05/background-2277_640.jpg",
    hearts: 88,
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2010/12/13/10/05/background-2277_640.jpg",
    hearts: 147,
  },
  {
    image:
      "https://cdn.pixabay.com/photo/2010/12/13/10/05/background-2277_640.jpg",
    hearts: 1002,
  },
]
