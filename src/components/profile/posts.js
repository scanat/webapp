import React, { useCallback, useEffect, useRef, useState } from "react"
import Layout from "../layout"
import postStyles from "./posts.module.css"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import AWS from "aws-sdk"
import Amplify, { API, graphqlOperation, Storage } from "aws-amplify"
import { getCurrentUser } from "../../utils/auth"
import Loader from "../loader"
import awsmobile from "../../aws-exports"
import { navigate } from "gatsby"

Amplify.configure(awsmobile)

const s3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

const pixelRatio =
  (typeof window !== "undefined" && window.devicePixelRatio) || 1

const Posts = () => {
  const topicRef = useRef(null)
  const descRef = useRef(null)
  const [postImage, setPostImage] = useState(null)
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
  const [loading, setLoading] = useState(false)

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

  const uploadImage = async (previewCanvas, crop) => {
    if (!crop || !previewCanvas) {
      return
    }

    const canvas = getCroppedImg(previewCanvas, crop.width, crop.height)

    const readyImage = canvas.toDataURL(imageDetails.type, 0.7)
    try {
      let params = {
        Bucket: process.env.GATSBY_S3_BUCKET,
        Key:
          "" +
          `public/${getCurrentUser()["custom:page_id"]}/posts/post${
            imageDetails.name
          }`,
        ContentType: imageDetails.type,
        Body: readyImage,
      }

      await s3.upload(params, (err, data) => {
        console.log(err, data)
        if (data) {
          setPostImage(readyImage)
          setImageSelector(false)
          setImageDetails({
            name: data.key,
            type: imageDetails.type,
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function uploadPost() {
    setLoading(true)
    let inputs = {
      input: {
        topic: topicRef.current.value,
        desc: descRef.current.value,
        img: imageDetails.name,
        status: true,
        postedBy: getCurrentUser()["custom:page_id"],
      },
    }
    try {
      await API.graphql(graphqlOperation(createPosts, inputs)).then(
        async res => {
          if (res) {
            await API.graphql(
              graphqlOperation(getSubscriber, {
                id: `${getCurrentUser()["custom:page_id"]}`,
              })
            ).then(async result => {
              if (result.data.getSubscriber.posts) {
                let array = result.data.getSubscriber.posts
                array.unshift(res.data.createPosts.id)

                if (result.data.getSubscriber.posts.length > 3) {
                  array = result.data.getSubscriber.posts.pop()
                  let params = {
                    input: {
                      id: getCurrentUser()["custom:page_id"],
                      posts: array,
                    },
                  }

                  await API.graphql(
                    graphqlOperation(updateSubscriber, params)
                  ).then(res1 => navigate("/profile/"))
                } else {
                  array = result.data.getSubscriber.posts
                  let params = {
                    input: {
                      id: getCurrentUser()["custom:page_id"],
                      posts: array,
                    },
                  }

                  await API.graphql(
                    graphqlOperation(updateSubscriber, params)
                  ).then(res1 => navigate("/profile/"))
                }
              }
            })
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Loader loading={loading} />
      <section className={postStyles.container}>
        {imageSelector && (
          <section className={postStyles.imageSelectorContainer}>
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
              onClick={() =>
                uploadImage(previewCanvasRef.current, completedCrop)
              }
              className={postStyles.button}
            >
              Upload
            </button>
          </section>
        )}
        <h2 className={postStyles.header}>Push Post</h2>
        <input
          ref={topicRef}
          type="text"
          placeholder="Enter headline"
          className={postStyles.inputText}
        />
        <textarea
          ref={descRef}
          maxLength={500}
          type="text"
          placeholder="Blow your trumpet here..."
          className={postStyles.inputDesc}
        />

        <section className={postStyles.imageContainer}>
          {postImage && (
            <img src={postImage} style={{ width: "100%", height: "100%" }} />
          )}
          <button
            className={postStyles.uploadButton}
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
        <button onClick={uploadPost} className={postStyles.uploadPostBtn}>
          Upload Post
        </button>
      </section>
    </Layout>
  )
}

export default Posts

export const createNotifications = /* GraphQL */ `
  mutation CreateNotifications($input: CreateNotificationsInput!) {
    createNotifications(input: $input) {
      id
    }
  }
`
export const createPosts = /* GraphQL */ `
  mutation CreatePosts($input: CreatePostsInput!) {
    createPosts(input: $input) {
      id
    }
  }
`
export const updateSubscriber = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      id
    }
  }
`
export const getSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      posts
    }
  }
`
