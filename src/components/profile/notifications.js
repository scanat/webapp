import React, { useCallback, useEffect, useRef, useState } from "react"
import Layout from "../layout"
import notificationStyles from "./notifications.module.css"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import AWS from "aws-sdk"

const notificationS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

const pixelRatio =
  (typeof window !== "undefined" && window.devicePixelRatio) || 1

const Notifications = () => {
  const imgForm = useRef(null)
  const takeImage = useRef(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageDetails, setImageDetails] = useState({ name: null, type: null })
  const [imageSelector, setImageSelector] = useState(false)
  const [crop, setCrop] = useState({ aspect: 1 / 1, width: 280 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const cropRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)

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

//   function getCroppedImg(canvas, newWidth, newHeight) {
//     const tmpCanvas = document.createElement("canvas")
//     tmpCanvas.width = newWidth
//     tmpCanvas.height = newHeight

//     const ctx = tmpCanvas.getContext("2d")
//     ctx.drawImage(
//       canvas,
//       0,
//       0,
//       canvas.width,
//       canvas.height,
//       0,
//       0,
//       newWidth,
//       newHeight
//     )

//     return tmpCanvas
//   }

//   const uploadImage = async (previewCanvas, crop) => {
//     if (!crop || !previewCanvas) {
//       return
//     }

//     const canvas = getCroppedImg(previewCanvas, crop.width, crop.height)

//     const readyImage = canvas.toDataURL(imageDetails.type)
//     try {
//       let tempJson = imagesJson
//       tempJson.images.push({
//         id: imagesJson.images.length,
//         imagedata: readyImage,
//       })
//       setImagesJson(tempJson)

//       await Storage.put(
//         `${getCurrentUser()["custom:page_id"]}/ambience.json`,
//         imagesJson,
//         { level: "public", contentType: "application/json" }
//       )
//       setImageSelector(false)
//     } catch (error) {
//       console.log(error)
//     }
//   }

  return (
    <Layout>
      <section className={notificationStyles.container}>
        {imageSelector && (
          <section className={notificationStyles.imageSelectorContainer}>
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
            <div style={{ height: "70vh" }}>
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
            //   onClick={() =>
            //     uploadImage(previewCanvasRef.current, completedCrop)
            //   }
              className={notificationStyles.button}
            >
              Upload
            </button>
          </section>
        )}
        <h2 className={notificationStyles.header}>Push Post</h2>
        <input
          type="text"
          placeholder="Enter topic"
          className={notificationStyles.inputText}
        />
        <textarea
          maxLength={500}
          type="text"
          placeholder="What are you up for today?"
          className={notificationStyles.inputDesc}
        />

        <section className={notificationStyles.imageContainer}>
          <button
            className={notificationStyles.uploadButton}
            onClick={() => takeImage.current.click()}
          >
            ^
          </button>
          <form ref={imgForm} hidden>
            <input
              ref={takeImage}
              id="itemId"
              type="file"
              onChange={selectImage}
              hidden
            />
            <button type="submit"></button>
          </form>
        </section>
      </section>
    </Layout>
  )
}

export default Notifications

export const createNotifications = /* GraphQL */ `
  mutation CreateNotifications($input: CreateNotificationsInput!) {
    createNotifications(input: $input) {
      id
    }
  }
`