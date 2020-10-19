import React, { useState, useEffect, useRef } from "react"
import Layout from "../../components/layout"
import portfolioStyles from "./portfolio.module.css"
import { getCurrentUser, setUser } from "../../utils/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AWS from "aws-sdk"
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
import { Link } from "gatsby"
import config from "../../config.json"
import axios from "axios"
import { faWindowClose } from "@fortawesome/free-regular-svg-icons"
import Loader from "../../components/loader"
import { API, Auth, graphqlOperation } from "aws-amplify"
import Banner from "../../components/portfolio/banner"
import SocialPlatform from "../../components/portfolio/socialPlatform"
import Logo from "../../components/portfolio/logo"

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

const Portfolio = () => {
  const [loading, setLoading] = useState(false)
  const [subscriberData, setSubscriberData] = useState({})
  const address1Ref = useRef("")
  const address2Ref = useRef("")
  const cityRef = useRef("")
  const stateRef = useRef("")
  const postalCodeRef = useRef("")
  const aboutRef = useRef("")

  useEffect(() => {
    getSubscriberPageData()
  }, [])

  async function getSubscriberPageData() {
    try {
      const subData = await API.graphql(
        graphqlOperation(portfolioData, {
          id: getCurrentUser()["custom:page_id"],
        })
      )
      setSubscriberData(subData.data.getSubscriber)
      address1Ref.current.value = subData.data.getSubscriber.address1
      address2Ref.current.value = subData.data.getSubscriber.address2
      cityRef.current.value = subData.data.getSubscriber.city
      stateRef.current.value = subData.data.getSubscriber.state
      postalCodeRef.current.value = subData.data.getSubscriber.postalCode
      aboutRef.current.value = subData.data.getSubscriber.about
    } catch (error) {
      console.log(error)
    }
  }

  async function updateAddress() {
    try {
      const addressData = await API.graphql(
        graphqlOperation(updateSubscriberAddress, {
          input: {
            id: getCurrentUser()['custom:page_id'],
            address1: address1Ref.current.value,
            address2: address2Ref.current.value,
            city: cityRef.current.value,
            state: stateRef.current.value,
            postalCode: postalCodeRef.current.value,
          },
        })
      )
      let tempData = subscriberData
      tempData.address1 = addressData.data.updateSubscriber.address1
      tempData.address2 = addressData.data.updateSubscriber.address1
      tempData.city = addressData.data.updateSubscriber.city
      tempData.state = addressData.data.updateSubscriber.state
      tempData.postalCode = addressData.data.updateSubscriber.postalCode
      setSubscriberData(tempData)
    } catch (error) {
      console.log(error)
    }
  }

  async function updateAbout() {
    try {
      const aboutData = await API.graphql(
        graphqlOperation(updateSubscriberAbout, {
          input: {
            id: getCurrentUser()['custom:page_id'],
            about: aboutRef.current.value,
          },
        })
      )
      let tempData = subscriberData
      tempData.about = aboutData.data.updateSubscriber.about
      setSubscriberData(tempData)
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
      {/* <Loader loading={loading} /> */}
      <Banner />

      <Logo loadHandler={val => setLoading(val)} />

      <SocialShare />

      {/* <PageId /> */}

      <section className={portfolioStyles.liveSpaceContainer}>
        <label className={portfolioStyles.liveSpaceText}>
          Live Accomodation{" "}
          <label className={portfolioStyles.liveSpaceNumber}>02</label>
        </label>
        <a
          href={`https://www.scanat.in/portfolio&id=${
            getCurrentUser()["custom:page_id"]
          }`}
        >
          <label className={portfolioStyles.menuMainText}>LIVE MENU</label>
        </a>
      </section>

      <SocialPlatform
        details={{
          twitter: subscriberData.twitter,
          facebook: subscriberData.facebook,
          pinterest: subscriberData.pinterest,
          instagram: subscriberData.instagram,
        }}
      />

      <section className={portfolioStyles.fullDescription}>
        <section className={portfolioStyles.businessLocation}>
          <FontAwesomeIcon icon={faMapMarkerAlt} color="crimson" size="3x" />
          <p className={portfolioStyles.topic}>ADDRESS</p>
          <input
            className={portfolioStyles.socialTextInput}
            placeholder={
              subscriberData.address1
                ? `${subscriberData.address1} (Address Line 1)`
                : "Address Line 1"
            }
            ref={address1Ref}
          />
          <br />
          <input
            className={portfolioStyles.socialTextInput}
            placeholder={
              subscriberData.address2
                ? `${subscriberData.address2} (Address Line 2)`
                : "Address Line 2"
            }
            ref={address2Ref}
          />
          <br />
          <input
            className={portfolioStyles.socialTextInput}
            placeholder={
              subscriberData.city
                ? `${subscriberData.city} (City)`
                : "City"
            }
            ref={cityRef}
          />
          <br />
          <input
            className={portfolioStyles.socialTextInput}
            placeholder={
              subscriberData.state
                ? `${subscriberData.state} (State)`
                : "State"
            }
            ref={stateRef}
          />
          <br />
          <input
            className={portfolioStyles.socialTextInput}
            placeholder={
              subscriberData.postalCode
                ? `${subscriberData.postalCode} (Postal Code)`
                : "Postal Code"
            }
            ref={postalCodeRef}
            inputMode="tel"
          />
          <br />
          <button onClick={updateAddress} className={portfolioStyles.button}>
            Update Address
          </button>
        </section>
        <br />

        <section className={portfolioStyles.businessDescription}>
          <FontAwesomeIcon icon={faInfo} color="crimson" size="3x" />
          <p className={portfolioStyles.topic}>
            About {getCurrentUser()["custom:page_id"]}
          </p>
          <label className={portfolioStyles.desc}>
            {subscriberData.category}
            <br/>
            <textarea
            className={portfolioStyles.aboutTextInput}
            placeholder={
              subscriberData.about
                ? `${subscriberData.about} (max length 80)`
                : `About ${getCurrentUser()["custom:page_id"]} (max length 80)`
            }
            ref={aboutRef}
            inputMode="tel"
            maxLength={80}
          />
          </label>
          <br />
          <button onClick={updateAbout} className={portfolioStyles.button}>
            Update about
          </button>
        </section>
      </section>

      <AmbiencePost
        loadHandler={val => setLoading(val)}
        category={subscriberData.category}
      />

      <DishesWeek />
    </Layout>
  )
}

export default Portfolio

const AmbiencePost = props => {
  const [ambienceList, setAmbienceList] = useState([{ name: "", image: "" }])
  const [width, setWidth] = useState()
  const uploadAmbienceInput = useRef(null)
  const ambienceForm = useRef(null)

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)

    getSubscriberPageData()
  }, [])

  async function getSubscriberPageData() {
    try {
      // const params = {
      //   TableName: "subscriberPage",
      //   Key: {
      //     pageId: getCurrentUser()["custom:page_id"],
      //   },
      // }
      // await subscriberPageDb.get(params, (err, result) => {
      //   result.Item.portfolioAmbiences &&
      //     getImageList(result.Item.portfolioAmbiences)
      //   console.log(process.env.GATSBY_S3_ACCESS_ID)
      // })
    } catch (error) {
      console.log(error)
    }
  }

  function getImageList(list) {
    list.map(element => {
      getImage(element)
    })
  }

  async function getImage(fileName) {
    props.loadHandler(true)
    try {
      // const paramsGet = {
      //   Bucket: "subscriber-media",
      //   Key: `Portfolio/${getCurrentUser()["custom:pageId"]}/${fileName}`,
      // }
      // await subscriberPageS3.getObject(paramsGet, (err, resp) => {
      //   if (resp) {
      //     let tempAmbienceList = { name: fileName, image: resp.Body }
      //     ambienceList.push(tempAmbienceList)
      //     let tempList = [...ambienceList]
      //     setAmbienceList(tempList)
      //     props.loadHandler(false)
      //   } else {
      //     props.loadHandler(false)
      //   }
      // })
    } catch (error) {
      props.loadHandler(false)
    }
  }

  const selectImage = async e => {
    props.loadHandler(true)
    const selectedFile = e.target.files[0]
    const reader = new FileReader(selectedFile)
    reader.readAsDataURL(selectedFile)
    reader.onload = async () => {
      const params = {
        TableName: "subscriberPage",
        ExpressionAttributeNames: {
          "#PAL": "portfolioAmbiences",
        },
        ExpressionAttributeValues: {
          ":a": selectedFile["name"],
          ":emptyList": [],
        },
        ReturnValues: "ALL_NEW",
        Key: {
          pageId: getCurrentUser()["custom:pageId"],
        },
        UpdateExpression:
          "SET #PAL = list_append(if_not_exists(#PAL, :emptyList), :a)",
      }
      await subscriberPageDb.update(params, (err, resp) => {
        resp && uploadImage(selectedFile, reader.result)
        props.loadHandler(false)
      })
    }
  }

  const uploadImage = async (selectedFile, imgUri) => {
    try {
      props.loadHandler(true)
      const params = {
        Bucket: "subscriber-media",
        Key: `Portfolio/${getCurrentUser()["custom:pageId"]}/${
          selectedFile["name"]
        }`,
        Body: imgUri,
      }

      await subscriberPageS3.upload(params, (err, resp) => {
        props.loadHandler(false)
        addNewImage(selectedFile["name"], imgUri)
      })
    } catch (error) {
      props.loadHandler(false)
      console.log(error)
    }
  }

  const addNewImage = (fileName, newImg) => {
    let tempAmbienceList = [...ambienceList]
    tempAmbienceList.push({ name: fileName, image: newImg })
    setAmbienceList(tempAmbienceList)
    console.log(ambienceList)
  }

  return (
    <section className={portfolioStyles.socialLinksContainer}>
      <p className={portfolioStyles.headerTopic}>
        Show off your {props.category}
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
            <section
              key={index}
              className={portfolioStyles.ambienceImageCardContainer}
            >
              {element["image"].length > 0 ? (
                <img
                  src={element["image"]}
                  alt={element["name"]}
                  className={portfolioStyles.ambienceImage}
                />
              ) : (
                <section className={portfolioStyles.ambienceInstructions}>
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    size="2x"
                    color="#169188"
                    onClick={() => uploadAmbienceInput.current.click()}
                  />
                  <form ref={ambienceForm} hidden>
                    <input
                      ref={uploadAmbienceInput}
                      id="itemId"
                      type="file"
                      onChange={selectImage}
                      hidden
                    />
                    <button type="submit"></button>
                  </form>
                </section>
              )}
            </section>
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
                  {fetchList.map((item, id) => (
                    <option key={id}>{item.itemName}</option>
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

  const finalizePageId = async () => {
    try {
      const params = {
        TableName: "subscriberPage",
        Item: {
          pageId: pageId,
        },
      }
      const response = await subscriberPageDb.put(params, (err, data) => {
        console.log(err, data)
      })
      const user = await Auth.currentAuthenticatedUser()
      const result = await Auth.updateUserAttributes(user, {
        "custom:pageId": pageId,
      })
      setUser(result)
    } catch (error) {}
  }

  return (
    <section className={portfolioStyles.orgTitle}>
      <h1>{getCurrentUser().name}</h1>

      <section className={portfolioStyles.socialLinkInputHolder}>
        <input
          ref={inputRef}
          className={portfolioStyles.socialTextInput}
          placeholder={
            getCurrentUser()["custom:pageId"] !== ""
              ? getCurrentUser()["custom:pageId"]
              : "New Page ID"
          }
          onFocus={e => {
            typeof window !== "undefined" &&
              document
                .getElementById("bulbGlowId")
                .setAttribute("color", e ? "green" : "grey")
          }}
          onChange={pageIdHandler}
          disabled={getCurrentUser()["custom:pageId"] !== "" ? true : false}
        />
        {getCurrentUser()["custom:pageId"] === "" && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="lg"
            color="#169188"
            onClick={finalizePageId}
          />
        )}
      </section>
      <label style={{ fontSize: "0.7em" }}>
        scanat.in/
        {getCurrentUser()["custom:pageId"] !== ""
          ? getCurrentUser()["custom:pageId"]
          : pageId}
      </label>
    </section>
  )
}

const SocialShare = () => {
  const [shareIconsVisible, setShareIconsVisible] = useState(false)

  return (
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
              href={`https://wa.me/?text=Here is my portfolio, please visit and help me share more! https://scanat.in/pro/portfolio${
                getCurrentUser().website
              }`}
              className={portfolioStyles.shareLink}
            >
              <FontAwesomeIcon icon={faWhatsapp} color="#075e54" size="lg" />
            </a>
          </li>
          <li>
            <a
              alt="Twitter"
              href={`https://twitter.com/share?text=Here is my portfolio, please visit and help me share more!&url=https://scanat.in/pro/portfolio${
                getCurrentUser().website
              }`}
              className={portfolioStyles.shareLink}
            >
              <FontAwesomeIcon icon={faTwitter} color="#00acee" size="lg" />
            </a>
          </li>
          <li>
            <a
              alt="Facebook"
              href={`https://facebook.com/sharer.php?u=https%3A%2F%2Fscanat.in/pro/portfolio${
                getCurrentUser().website
              }[title]=Here+is+my+portfolio,+please+visit+and+help+me+share+more!`}
              className={portfolioStyles.shareLink}
            >
              <FontAwesomeIcon icon={faFacebookF} color="#3b5998" size="lg" />
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
              <FontAwesomeIcon icon={faPinterestP} color="#e60023" size="lg" />
            </a>
          </li>
        </ul>
      </li>
    </ul>
  )
}

export const portfolioData = /*GraphQL*/ `
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
      logo
      orgName
      phoneNumber
      pinterest
      twitter
    }
  }
`
export const updateSubscriberAddress = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      address1
      address2
      city
      state
      postalCode
    }
  }
`

export const updateSubscriberAbout = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      about
    }
  }
`