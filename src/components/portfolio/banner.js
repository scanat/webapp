import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef, useState } from "react"
import bannerStyles from "./banner.module.css"
import Img from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"
import Loader from "../loader"

const Banner = () => {
  const [bannerData, setBannerData] = useState(null)
  const uploadBannerInput = useRef(null)
  const bannerForm = useRef(null)
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const query = useStaticQuery(graphql`
    {
      file(relativePath: { eq: "portfolio-banner.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 1920, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  useEffect(() => {
    getImageName()
  }, [])

  async function getImageName() {
    setLoading(true)
    try {
      // const params = {
      //   TableName: "subscriberPage",
      //   Key: {
      //     pageId: getCurrentUser()["custom:pageId"],
      //   },
      // }
      // await subscriberPageDb.get(params, (err, resp) => {
      //   getImage(resp.Item.portfolioBanner)
      //   props.loadHandler(false)
      // })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  async function getImage(fileName) {
    setLoading(true)
    try {
      // const paramsGet = {
      //   Bucket: "subscriber-media",
      //   Key: `Portfolio/${getCurrentUser()["custom:pageId"]}/${fileName}`,
      // }
      // await subscriberPageS3.getObject(paramsGet, (err, resp) => {
      //   if (resp) {
      //     setBannerData(resp.Body)
      //     props.loadHandler(false)
      //   } else {
      //     props.loadHandler(false)
      //   }
      // })
    } catch (error) {
      setLoading(false)
    }
  }

  const selectImage = async e => {
    // props.loadHandler(true)
    // const selectedFile = e.target.files[0]
    // const reader = new FileReader(selectedFile)
    // reader.readAsDataURL(selectedFile)
    // reader.onload = () => {
    //   setImageUrl(reader.result)
    //   // setFile(selectedFile)
    // }
    // const params = {
    //   TableName: "subscriberPage",
    //   ExpressionAttributeNames: {
    //     "#PB": "portfolioBanner",
    //   },
    //   ExpressionAttributeValues: {
    //     ":b": selectedFile["name"],
    //   },
    //   ReturnValues: "ALL_NEW",
    //   Key: {
    //     pageId: getCurrentUser()["custom:pageId"],
    //   },
    //   UpdateExpression: "SET #PB = :b",
    // }
    // await subscriberPageDb.update(params, (err, resp) => {
    //   resp && uploadImage(selectedFile)
    //   props.loadHandler(false)
    // })
  }

  const uploadImage = async selectedFile => {
    try {
      //   props.loadHandler(true)
      //   const params = {
      //     Bucket: "subscriber-media",
      //     Key: `Portfolio/${getCurrentUser()["custom:pageId"]}/${
      //       selectedFile["name"]
      //     }`,
      //     Body: imageUrl,
      //   }
      //   await subscriberPageS3.upload(params, (err, resp) => {
      //     props.loadHandler(false)
      //     resp && getImageName()
      //   })
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <section className={bannerStyles.banner}>
      {/* <Loader loading={loading} /> */}
      {bannerData === null ? (
        <Img fluid={query.file.childImageSharp.fluid} />
      ) : (
        <img src={bannerData} alt="Portfolio Banner" />
      )}
      <section
        className={bannerStyles.editHolder}
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
          <button type="submit"></button>
        </form>
      </section>
    </section>
  )
}
export default Banner
