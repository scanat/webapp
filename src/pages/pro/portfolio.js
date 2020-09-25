import React, { useState, useEffect, useRef } from "react"
import Layout from "../../components/layout"
import portfolioStyles from "./portfolio.module.css"
import PortfolioBanner from "../../images/portfolio-banner.jpg"
import { getCurrentUser } from "../../utils/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AWS, { S3 } from 'aws-sdk'
import {
  faAngleLeft,
  faAngleRight,
  faCamera,
  faCheckCircle,
  faEllipsisH,
  faEllipsisV,
  faHeart,
  faInfo,
  faMapMarkerAlt,
  faPlusCircle,
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
import config from "../../config.json"
import axios from "axios"
import dishImage from "../../images/burger.jpg"
import { faLightbulb, faWindowClose } from "@fortawesome/free-regular-svg-icons"

const s3 = new AWS.S3({
  accessKeyId: config.s3.ACCESS_ID,
  secretAccessKey: config.s3.SECRET_ACCESS_KEY
})

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

const CardLayoutInput = props => {
  return (
    <section className={portfolioStyles.ambienceImageCardContainer}>
      {props.image !== "" ? (
        <img
          src={props.image}
          alt={props.image}
          className={portfolioStyles.ambienceImage}
        />
      ) : (
        <section className={portfolioStyles.ambienceInstructions}>
          <FontAwesomeIcon icon={faPlusCircle} size="2x" color="#169188" />
        </section>
      )}
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
          placeholder="Your Instagram ID"
        />
      </section>
    </section>
  )
}

const AmbiencePost = () => {
  const [ambienceList, setAmbienceList] = useState([])
  const [width, setWidth] = useState()

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)
    ambienceList.push({ image: "" })
  }, [])

  return (
    <section className={portfolioStyles.socialLinksContainer}>
      <p className={portfolioStyles.headerTopic}>
        Show off your {getCurrentUser()["custom:category"]}
      </p>
      <label className={portfolioStyles.smallDesc}>
        It is like a gallery that attracts your viewers right off to your place
        of business
      </label>
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
          {ambienceList.map((element, index) => (
            <CardLayoutInput key={index} image={element["image"]} />
          ))}
        </Carousel>
      </section>
    </section>
  )
}

const DishesWeek = () => {
  const [itemList, setItemList] = useState([])
  const [fetchList, setFetchList] = useState([])

  useEffect(() => {
    itemList.push({ image: "", price: "", itemName: "" })
    fetchData()
  }, [])

  // Fetch inital data if available
  const fetchData = async () => {
    try {
      const params = JSON.stringify({
        phoneNumber: String(getCurrentUser().phone_number).replace("+91", ""),
      })
      const res = await axios.post(`${config.userDataAPI}/items/get`, params)
      setFetchList(res.data.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Add Item to Item List
  const addItem = e => {
    fetchList.forEach(element => {
      if (element.itemName === e.target.value) {
        let tempList = [...itemList]
        tempList.unshift(element)
        setItemList(tempList)
      }
    })
    console.log(fetchList)
  }

  // Offer and Price Handlers
  const newItemPriceHandler = (e, id) => {
    let tempList = [...itemList]
    tempList[id].offerPrice = e
    tempList[id].offerValue = ((1 - e / tempList[id].itemPrice) * 100).toFixed(
      2
    )
    setItemList(tempList)
  }

  const newOfferValueHandler = (e, id) => {
    let tempList = [...itemList]
    tempList[id].offerValue = e
    tempList[id].offerPrice = (
      tempList[id].itemPrice -
      (e / 100) * tempList[id].itemPrice
    ).toFixed(2)
    setItemList(tempList)
  }

  return (
    <section className={portfolioStyles.dishesWeek}>
      <h2 className={portfolioStyles.headerTopic}>dishes of the week</h2>
      {itemList.map((item, id) => (
        <section className={portfolioStyles.dishesContainer} key={id}>
          <FontAwesomeIcon
            className={portfolioStyles.closeTopRight}
            icon={faWindowClose}
            size="lg"
            color="whitesmoke"
          />
          <section className={portfolioStyles.dishesImage}>
            {item.image !== "" ? (
              <img
                src={item.itemImage}
                alt={item.itemImage}
                className={portfolioStyles.ambienceImage}
              />
            ) : (
              <section className={portfolioStyles.ambienceInstructions}>
                <label
                  className={portfolioStyles.smallDesc}
                  style={{ color: "whitesmoke" }}
                >
                  Select your offered item
                </label>
                <select
                  className={portfolioStyles.fetchedItemsOptions}
                  onChange={addItem}
                >
                  {fetchList.map(item => (
                    <option>{item.itemName}</option>
                  ))}
                </select>
              </section>
            )}
          </section>
          <section style={{ textAlign: "center" }}>
            <h4 className={portfolioStyles.dishName}>
              {item.status ? item.itemName : "Dish Name"}
            </h4>
            <textarea
              className={portfolioStyles.textAreaInput}
              style={{ width: "250px", height: "40px" }}
              placeholder="This is a little description of the item that has been newly added
              here."
            >
              {item.status && item.itemDesc}
            </textarea>
            <p className={portfolioStyles.offerprice}>
              <strike className={portfolioStyles.strokePrice}>
                Rs. {item.status ? item.itemPrice : 1000}
              </strike>{" "}
              Rs.{" "}
              <input
                className={portfolioStyles.textAreaInput}
                style={{ maxWidth: "40px" }}
                placeholder="800"
                inputMode="tel"
                onChange={e => newItemPriceHandler(e.target.value, id)}
              />{" "}
              /- <br />
              <label className={portfolioStyles.offerOff}>
                (
                <input
                  className={portfolioStyles.textAreaInput}
                  style={{ maxWidth: "30px" }}
                  placeholder="20"
                  inputMode="tel"
                  onChange={e => newOfferValueHandler(e.target.value, id)}
                  value={item.offerValue}
                  disabled
                />{" "}
                % OFF)
              </label>
            </p>
          </section>
        </section>
      ))}
    </section>
  )
}

const PageId = () => {
  const [pageId, setPageId] = useState("")
  const inputRef = useRef(null)

  const pageIdHandler = e => {
    let inputElement = inputRef.current
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    let text = e.target.value
    if (!format.test(text)) {
      setPageId(text)
      inputElement.style.borderColor = "grey"
    } else {
      inputElement.style.borderColor = "red"
    }
  }

  const finalizePageId = () => {
    inputRef.current.disabled = true
  }

  return (
    <section className={portfolioStyles.orgTitle}>
      <h1>{getCurrentUser().name}</h1>
      <label style={{ fontSize: "0.7em" }}>
        Your Page ID is irreversible, kindly cross check before making a permanent
        change
      </label>
      <section className={portfolioStyles.socialLinkInputHolder}>
        <label style={{ fontSize: "1rem", margin: "0 5px" }}>
          Create a ScanAt Page{" "}
        </label>
        <FontAwesomeIcon id="bulbGlowId" icon={faLightbulb} color="grey" />
        <input
          ref={inputRef}
          className={portfolioStyles.socialTextInput}
          placeholder="New Page ID"
          onFocus={e => {
            typeof window !== "undefined" &&
              document
                .getElementById("bulbGlowId")
                .setAttribute("color", e ? "green" : "grey")
          }}
          onChange={pageIdHandler}
        />
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="lg"
          color="#169188"
          onClick={finalizePageId}
        />
      </section>
      <label style={{ fontSize: "0.7em" }}>scanat.in/{pageId}</label>
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
    const params = {
      Bucket: 'subscriber-media',
      Key: `Portfolio/something.png`,
      Body: JSON.stringify(imageUrl, null, 2)
    }

    s3.upload(params, (err, data) => {console.log(err, data)})
    // try {
    //   const params = JSON.stringify({
    //     phoneNumber: getCurrentUser().phone_number,
    //     image: imageUrl,
    //     name: file.name,
    //     size: file.size,
    //     type: file.type,
    //   })
    //   console.log(params)
    //   const res = await axios.post(
    //     `${config.invokeUrl}/subscriberdata/add/banner`,
    //     params
    //   )
    //   console.log(res)
    // } catch (error) {
    //   console.log(error)
    // }
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

      <PageId />

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

      <AmbiencePost />

      <DishesWeek />
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
