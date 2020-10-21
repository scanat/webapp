import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify"
import React, { useRef, useState, useEffect, useCallback } from "react"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import AWS from "aws-sdk"
import awsmobile from "../../aws-exports"
import { getCurrentUser } from "../../utils/auth"
import logoStyles from "./logo.module.css"

const subscriberLogoS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

Amplify.configure(awsmobile)

const pixelRatio =
  (typeof window !== "undefined" && window.devicePixelRatio) || 1

const Logo = props => {
  const [logoData, setLogoData] = useState(null)
  const uploadLogoInput = useRef(null)
  const logoForm = useRef(null)
  const [imageUrl, setImageUrl] = useState("")
  const cropRef = useRef("")
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [imageSelector, setImageSelector] = useState(false)
  const [crop, setCrop] = useState({ aspect: 1 / 1, width: 100 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imageDetails, setImageDetails] = useState({ name: "", type: "" })

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

  useEffect(() => {
    getImage()
  }, [])

  async function getImage() {
    try {
      const imgName = await API.graphql(
        graphqlOperation(getSubscriberLogo, {
          id: getCurrentUser()["custom:page_id"],
        })
      )
      const params = {
        Bucket: awsmobile.aws_user_files_s3_bucket,
        Key: `public/${getCurrentUser()["custom:page_id"]}/${
          imgName.data.getSubscriber.logo
        }`,
      }
      await subscriberLogoS3.getObject(params, (err, resp) => {
        resp && setLogoData(resp.Body)
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
        `${getCurrentUser()["custom:page_id"]}/logo${imageDetails.name}`,
        readyImage
      )
      const inputs = {
        input: {
          id: getCurrentUser()["custom:page_id"],
          logo: "logo" + imageDetails.name,
        },
      }
      const data = await API.graphql(
        graphqlOperation(updateSubscriberLogo, inputs)
      )
      if (storeImg && data) {
        setLogoData(readyImage)
        setImageSelector(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {imageSelector && (
        <section className={logoStyles.imageSelectorContainer}>
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
            className={logoStyles.button}
          >
            Upload Banner
          </button>
        </section>
      )}
      <section className={logoStyles.logoContainer}>
        {logoData === null ? (
          <label className={logoStyles.logoText}>
            {getCurrentUser().name.substring(0, 2)}
          </label>
        ) : (
          <img src={logoData} alt="Logo" />
        )}
      </section>
      <section
        className={logoStyles.editDpHolder}
        onClick={() => uploadLogoInput.current.click()}
      >
        <FontAwesomeIcon icon={faCamera} size="1x" color="#169188" />
        <form ref={logoForm} hidden>
          <input
            ref={uploadLogoInput}
            id="itemId"
            type="file"
            onChange={selectImage}
            hidden
          />
          <button type="submit"></button>
        </form>
      </section>
    </>
  )
}

export default Logo

export const updateSubscriberLogo = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      logo
    }
  }
`
export const getSubscriberLogo = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      logo
    }
  }
`
