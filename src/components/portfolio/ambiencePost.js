import React, { useEffect, useRef, useState, useCallback } from "react"
import ambienceStyles from "./ambiencePost.module.css"
import Carousel from "react-elastic-carousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleLeft,
  faAngleRight,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons"
import AWS from "aws-sdk"

const subscriberAmbienceS3 = new AWS.S3({
  region: "ap-south-1",
  accessKeyId: process.env.GATSBY_S3_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_S3_ACCESS_SECRET,
})

const AmbiencePost = props => {
  const [width, setWidth] = useState()
  const [imagesJson, setImagesJson] = useState({ images: [] })

  useEffect(() => {
    if (document.body.offsetWidth < 481) setWidth(1)
    else if (document.body.offsetWidth < 600) setWidth(2)
    else if (document.body.offsetWidth < 1024) setWidth(4)
    else setWidth(5)

    imagesJson.images.length === 0 && getImage()
  }, [props.id])

  async function getImage() {
    try {
      const params = {
        Bucket: process.env.GATSBY_S3_BUCKET,
        Key: `public/${props.id}/ambience.json`,
      }
      await subscriberAmbienceS3.getObject(params, (err, resp) => {
        let resJson = new TextDecoder("utf-8").decode(resp.Body)
        resJson = JSON.parse(resJson)
        setImagesJson({ images: imagesJson.images.concat(resJson.images) })
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={ambienceStyles.socialLinksContainer}>
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
              style={{ margin: "50px 10px 0 10px" }}
            />
          )}
        >
          {imagesJson.images.map((element, index) => (
            <section
              key={index}
              className={ambienceStyles.ambienceImageCardContainer}
            >
              <img
                src={element.imagedata}
                alt={element.id}
                className={ambienceStyles.ambienceImage}
              />
            </section>
          ))}
        </Carousel>
      </section>
    </section>
  )
}

export default AmbiencePost
