import React, { useEffect, useRef, useState, useCallback } from "react"
import ambienceStyles from "./ambiencePost.module.css"
import Carousel from "react-elastic-carousel"
import Loader from "../../components/loader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleLeft,
  faAngleRight,
  faEllipsisH,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import AWS from "aws-sdk"
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify"
import awsmobile from "../../aws-exports"
import { getCurrentUser } from "../../utils/auth"

const subscriberAmbienceS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

Amplify.configure(awsmobile)

const pixelRatio =
  (typeof window !== "undefined" && window.devicePixelRatio) || 1

const AmbiencePost = props => {
  const [ambienceList, setAmbienceList] = useState([{ name: "", image: "" }])
  const [loading, setLoading] = useState(false)
  const cropRef = useRef("")
  const [width, setWidth] = useState()
  const uploadAmbienceInput = useRef(null)
  const ambienceForm = useRef(null)
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [imageSelector, setImageSelector] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [crop, setCrop] = useState({ aspect: 10 / 7, width: 320 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imageDetails, setImageDetails] = useState({ name: "", type: "" })

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)

    getImage()
  }, [])

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
    ctx.imageSmoothingQuality = "high"

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

  async function getImage() {
    try {
      const params = {
        Bucket: awsmobile.aws_user_files_s3_bucket,
        Prefix: `public/${getCurrentUser()["custom:page_id"]}/ambience/`,
      }
      await subscriberAmbienceS3.listObjects(params, (err, resp) => {
        console.log(resp)
        resp.Contents.forEach(element => {
          getIndividualImage(element.Key)
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function getIndividualImage(key) {
    try {
      const paramsImg = {
        Bucket: awsmobile.aws_user_files_s3_bucket,
        Key: key,
      }
      await subscriberAmbienceS3.getObject(paramsImg, (err, resp) => {
        const temp = ambienceList
        temp.push({ name: "", image: resp.Body })
        setAmbienceList(temp)
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
      setImageDetails({ name: selectedFile.name, type: selectedFile.type })
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
      const storeImg = await Storage.put(
        `${getCurrentUser()["custom:page_id"]}/ambience/ambience${
          imageDetails.name
        }`,
        readyImage
      )
      if (storeImg) {
        const temp = ambienceList
        temp.push({ name: ambienceList.length, image: readyImage })
        setAmbienceList(temp)
        setImageSelector(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={ambienceStyles.socialLinksContainer}>
      {/* <Loader loading={loading} /> */}
      {imageSelector && (
        <section className={ambienceStyles.imageSelectorContainer}>
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
            className={ambienceStyles.button}
          >
            Upload
          </button>
        </section>
      )}
      <p className={ambienceStyles.headerTopic}>
        Show off your {props.category}
      </p>
      <label className={ambienceStyles.smallDesc}>
        It is like a gallery that attracts your viewers right off to your place
        of business
      </label>
      <section className={ambienceStyles.ourDeals}>
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
              className={ambienceStyles.ambienceImageCardContainer}
            >
              {element["image"].length > 0 ? (
                <img
                  src={element["image"]}
                  alt={element["name"]}
                  className={ambienceStyles.ambienceImage}
                />
              ) : (
                <section className={ambienceStyles.ambienceInstructions}>
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

export default AmbiencePost
