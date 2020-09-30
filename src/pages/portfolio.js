import React, { useState, useEffect, useRef } from "react"
import Layout from "../components/layout"
import portfolioStyles from "./portfolio.module.css"
import PortfolioBanner from "../images/portfolio-banner.jpg"
import { getCurrentUser } from "../utils/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faCamera,
  faCaretUp,
  faEllipsisH,
  faEllipsisV,
  faHeart,
  faInfo,
  faMapMarkerAlt,
  faShare,
  faShareAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons"
import Carousel from "react-elastic-carousel"
import {
  faFacebookF,
  faInstagram,
  faPinterestP,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"
import { Link, navigate } from "gatsby"
import config from "../config.json"
import axios from "axios"
import dishImage from "../images/burger.jpg"
import { faLightbulb } from "@fortawesome/free-regular-svg-icons"

const CardLayout = props => {
  return (
    <section className={portfolioStyles.cardContainer}>
      <img
        src={props.image}
        alt={props.image}
        className={portfolioStyles.image}
      />
      {/* <label className={portfolioStyles.hearts}>
        {props.hearts}
        <FontAwesomeIcon icon={faHeart} color="crimson" />
      </label> */}
    </section>
  )
}

const DishesLayout = () => {
  return (
    <section className={portfolioStyles.dishesContainer}>
      <img
        src={dishImage}
        alt="Scan At Dish Image"
        className={portfolioStyles.dishesImage}
      />
      <section>
        <h4 className={portfolioStyles.dishName}>Dish Name</h4>
        <p className={portfolioStyles.dishDescription}>
          This is a little description of the item that has been newly added
          here.
        </p>
        <p className={portfolioStyles.offerprice}>
          <strike className={portfolioStyles.strokePrice}>Rs. 1000</strike> Rs.
          840/- <label className={portfolioStyles.offerOff}>(20% OFF)</label>
        </p>
      </section>
    </section>
  )
}

const SocialPlatformLink = () => {
  return (
    <section className={portfolioStyles.socialLinksContainer}>
      <p className={portfolioStyles.headerTopic}>
        {" "}
        Bring folowers to your social media pages
      </p>
      <section className={portfolioStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faTwitter} size="lg" color="#00acee" />
        <input
          className={portfolioStyles.socialTextInput}
          placeholder="Your Twitter ID"
        />
      </section>
      <section className={portfolioStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faFacebookF} size="lg" color="#3b5998" />
        <input
          className={portfolioStyles.socialTextInput}
          placeholder="Your Facebook Page"
        />
      </section>
      <section className={portfolioStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faPinterestP} size="lg" color="#e60023" />
        <input
          className={portfolioStyles.socialTextInput}
          placeholder="Your Pinterest ID"
        />
      </section>
      <section className={portfolioStyles.socialLinkInputHolder}>
        <FontAwesomeIcon icon={faInstagram} size="lg" color="#3f729b" />
        <input
          className={portfolioStyles.socialTextInput}
          placeholder="Your Instagram Page"
        />
      </section>
    </section>
  )
}

const Portfolio = () => {
  const [subMenu, setSubMenu] = useState(false)
  const uploadBannerInput = useRef(null)
  const bannerForm = useRef(null)
  const [imageUrl, setImageUrl] = useState("")
  const [file, setFile] = useState("")
  const [shareIconsVisible, setShareIconsVisible] = useState(false)
  const [width, setWidth] = useState()
  const [rated, setRated] = useState(0)

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)
  }, [])

  const selectImage = e => {
    const selectedFile = e.target.files[0]
    const reader = new FileReader(selectedFile)
    reader.readAsDataURL(selectedFile)
    reader.onload = () => {
      setImageUrl(reader.result)
      setFile(selectedFile)
    }
    uploadBanner()
  }

  const uploadBanner = async e => {
    try {
      const params = JSON.stringify({
        phoneNumber: getCurrentUser().phone_number,
        image: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      })
      console.log(params)
      const res = await axios.post(
        `${config.invokeUrl}/subscriberdata/add/banner`,
        params
      )
      console.log(res)
    } catch (error) {
      console.log(error)
    }
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
      <label>
        You can login using [{" "}
        <FontAwesomeIcon icon={faEllipsisV} size="lg" color="#169188" /> ] on
        the top right corner
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
        <section
          className={portfolioStyles.editHolder}
          onClick={() => uploadBannerInput.current.click()}
        >
          <FontAwesomeIcon icon={faCamera} size="lg" color="#169188" />
          <form ref={bannerForm} hidden>
            <input
              ref={uploadBannerInput}
              id="itemId"
              type="file"
              onChange={selectImage}
              hidden
            />
            <button type="submit" onSubmit={uploadBanner}></button>
          </form>
        </section>
      </section>

      <section className={portfolioStyles.logoContainer}>
        <label className={portfolioStyles.logoText}>
          {getCurrentUser().name.substring(0, 2)}
        </label>
      </section>
      <section
        className={portfolioStyles.editDpHolder}
        onClick={() => uploadBannerInput.current.click()}
      >
        <FontAwesomeIcon icon={faCamera} size="1x" color="#169188" />
        <form ref={bannerForm} hidden>
          <input
            ref={uploadBannerInput}
            id="itemId"
            type="file"
            onChange={selectImage}
            hidden
          />
          <button type="submit" onSubmit={uploadBanner}></button>
        </form>
      </section>

      <ul className={portfolioStyles.shareListContainer}>
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
      </ul>

      <section className={portfolioStyles.orgTitle}>
        <h1>{getCurrentUser().name}</h1>
        <section className={portfolioStyles.socialLinkInputHolder}>
          <label style={{ fontSize: "1rem", margin: "0 5px" }}>
            Create a ScanAt Page{" "}
          </label>
          <FontAwesomeIcon id="bulbGlowId" icon={faLightbulb} color="grey" />
          <input
            className={portfolioStyles.socialTextInput}
            placeholder="New Page ID"
            onFocus={ () =>
              typeof window !== "undefined" &&
              document
                .getElementById("bulbGlowId")
                .setAttribute("color", "green")
            }
          />
        </section>
      </section>

      <section className={portfolioStyles.liveSpaceContainer}>
        <label className={portfolioStyles.liveSpaceText}>
          Live Accomodation{" "}
          <label className={portfolioStyles.liveSpaceNumber}>02</label>
        </label>
        <a href={`https://www.scanat.in${getCurrentUser().website}`}>
          <label className={portfolioStyles.menuMainText}>LIVE MENU</label>
        </a>
      </section>

      <SocialPlatformLink />

      <section className={portfolioStyles.fullDescription}>
        <section className={portfolioStyles.businessLocation}>
          <FontAwesomeIcon icon={faMapMarkerAlt} color="crimson" size="3x" />
          <p className={portfolioStyles.topic}>ADDRESS</p>
          <label className={portfolioStyles.desc}>
            {getCurrentUser()["custom:address_line_1"] +
              " " +
              getCurrentUser()["custom:address_line_2"] +
              " " +
              getCurrentUser()["custom:city"] +
              " " +
              getCurrentUser()["custom:state"]}
          </label>
        </section>
        <br />

        <section className={portfolioStyles.businessDescription}>
          <FontAwesomeIcon icon={faInfo} color="crimson" size="3x" />
          <p className={portfolioStyles.topic}>About {getCurrentUser().name}</p>
          <label className={portfolioStyles.desc}>
            {getCurrentUser()["custom:category"]}
          </label>
        </section>
      </section>

      <section className={portfolioStyles.ourDealsContainer}>
        {/* <h2 className={portfolioStyles.headerTopic}>our top deals</h2> */}
        <section className={portfolioStyles.ourDeals}>
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

      <section className={portfolioStyles.dishesWeek}>
        <h2 className={portfolioStyles.headerTopic}>dishes of the week</h2>
        {dishes.map((item, id) => (
          <DishesLayout key={id} />
        ))}
      </section>

      <section className={portfolioStyles.reviewContainer}>
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
      </section>

      <section className={portfolioStyles.bulkOrders}>
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

let dishes = [
  {
    image: "",
  },
  {
    image: "",
  },
  {
    image: "",
  },
  {
    image: "",
  },
]
