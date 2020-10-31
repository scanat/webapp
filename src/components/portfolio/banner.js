import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback, useEffect, useRef, useState } from "react"
import bannerStyles from "./banner.module.css"
import Img from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"
import Loader from "../loader"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import AWS from "aws-sdk"
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify"
import awsmobile from "../../aws-exports"
import { getCurrentUser } from "../../utils/auth"

const subscriberPageS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

Amplify.configure(awsmobile)

const pixelRatio =
  (typeof window !== "undefined" && window.devicePixelRatio) || 1

const Banner = () => {
  const [bannerData, setBannerData] = useState(null)
  const uploadBannerInput = useRef(null)
  const cropRef = useRef("")
  const bannerForm = useRef(null)
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [imageSelector, setImageSelector] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [crop, setCrop] = useState({ aspect: 16 / 9, width: 320 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imageDetails, setImageDetails] = useState({ name: "", type: "", url: "" })
  const [loading, setLoading] = useState(false)

  const onLoad = useCallback(img => {
    imgRef.current = img
  })

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext("2d")

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = "low"

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
  }, [completedCrop])

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
    getImage()
  }, [])

  async function getImage() {
    try {
      const imgName = await API.graphql(
        graphqlOperation(getSubscriberBanner, {
          id: getCurrentUser()["custom:page_id"],
        })
      )
      imageDetails.url = imgName.data.getSubscriber.banner
      const params = {
        Bucket: awsmobile.aws_user_files_s3_bucket,
        Key: `public/${
          imgName.data.getSubscriber.banner
        }`,
      }
      await subscriberPageS3.getObject(params, (err, resp) => {
        resp && setBannerData(resp.Body)
      })
    } catch (error) {
      console.log(error)
    }
  }
  function getCroppedImg(canvas, newWidth, newHeight) {
    const tmpCanvas = document.createElement("canvas")
    tmpCanvas.width = newWidth
    tmpCanvas.height = newHeight

    const ctx = tmpCanvas.getContext("2d")
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      newWidth,
      newHeight
    )

    return tmpCanvas
  }

  const selectImage = async e => {
    const selectedFile = e.target.files[0]
    const reader = new FileReader(selectedFile)
    reader.readAsDataURL(selectedFile)
    reader.onload = () => {
      setImageUrl(reader.result)
      setImageDetails({ name: selectedFile.name, type: selectedFile.type, url: imageDetails.url })
    }
    setImageSelector(true)
  }

  const uploadImage = async (previewCanvas, crop) => {
    if (!crop || !previewCanvas) {
      return
    }

    const canvas = getCroppedImg(previewCanvas, crop.width, crop.height)

    const readyImage = canvas.toDataURL(imageDetails.type)
    try {
      bannerData && Storage.remove(imageDetails.url)
      const storeImg = await Storage.put(
        `${getCurrentUser()["custom:page_id"]}/banner${imageDetails.name}`,
        readyImage,
        {
          level: "public",
          contentType: imageDetails.type,
          contentEncoding: "base64",
        }
      )
      const inputs = {
        input: {
          id: getCurrentUser()["custom:page_id"],
          banner: storeImg.key,
        },
      }
      const data = await API.graphql(
        graphqlOperation(updateSubscriberBanner, inputs)
      )
      if (storeImg && data) {
        setBannerData(readyImage)
        setImageSelector(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={bannerStyles.banner}>
      {/* <Loader loading={loading} /> */}
      {imageSelector && (
        <section className={bannerStyles.imageSelectorContainer}>
          <ReactCrop
            src={imageUrl}
            crop={crop}
            onChange={newCrop => setCrop(newCrop)}
            style={{ marginTop: 44 }}
            ruleOfThirds
            onComplete={c => setCompletedCrop(c)}
            onImageLoaded={onLoad}
            ref={cropRef}
          />
          <div style={{height: '70vh'}}>
            <canvas
              ref={previewCanvasRef}
              style={{
                width: 1920,
                height: "auto",
                display: "none",
              }}
            />
          </div>
          <button
            onClick={() => uploadImage(previewCanvasRef.current, completedCrop)}
            className={bannerStyles.button}
          >
            Upload Banner
          </button>
        </section>
      )}
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
            accept="image/*"
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

export const updateSubscriberBanner = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      banner
    }
  }
`
export const getSubscriberBanner = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      banner
    }
  }
`
