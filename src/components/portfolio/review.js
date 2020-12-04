import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef, useState } from "react"
import reviewStyles from "./review.module.css"
import Carousel from "react-elastic-carousel"
import {
  faCommentAlt,
  faStar,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons"
import Anime from "animejs"
import { text } from "@fortawesome/fontawesome-svg-core"

const Review = props => {
  const [writeReview, setWriteReview] = useState(false)
  const containerRef = useRef(null)
  const writeReviewRef = useRef(null)

  useEffect(() => {
    props.show
      ? Anime({
          targets: containerRef.current,
          bottom: ["-350px", 0],
          easing: "linear",
          duration: 200,
        }).play()
      : Anime({
          targets: containerRef.current,
          bottom: [0, "-350px"],
          easing: "linear",
          duration: 200,
        }).play()
  }, [props.show])

  useEffect(() => {
    writeReview
      ? Anime({
          targets: writeReviewRef.current,
          left: ["-100%", "10%"],
          easing: "linear",
          duration: 200,
        })
      : Anime({
          targets: writeReviewRef.current,
          left: ["10%", "-100%"],
          easing: "linear",
          duration: 200,
        })
  }, [writeReview])

  return (
    <section ref={containerRef} className={reviewStyles.container}>
      <FontAwesomeIcon
        icon={faCommentAlt}
        size="lg"
        style={{ position: "absolute", right: "5%", top: "20px" }}
        onClick={() => setWriteReview(!writeReview)}
      />
      <Carousel
        enableSwipe
        itemsToShow={1}
        verticalMode={false}
        pagination={false}
        showArrows={false}
      >
        {data.map((item, index) => (
          <section className={reviewStyles.itemContainer} key={index}>
            <h3>{props.orgName}</h3>
            <label>"{item.recommendation}"</label>
            <section>
              {[...Array(item.rating)].map(() => (
                <FontAwesomeIcon
                  icon={faStar}
                  color="#ffc400"
                  size="xs"
                  style={{ margin: "0 2px" }}
                />
              ))}
            </section>
            <p className={reviewStyles.comment}>{item.comment}</p>
            <h5>~{item.name}</h5>
          </section>
        ))}
      </Carousel>

      <section
        ref={writeReviewRef}
        className={reviewStyles.writeReviewContainer}
      >
        <FontAwesomeIcon
          icon={faUserCircle}
          size="4x"
          color="rgb(104, 79, 79)"
          style={{ margin: "10px 5px", float: "left" }}
        />
        <input type="text" maxLength={20} placeholder="Your name" />
        <br />
        <label>Your reviews will be posted publicly on the web.</label>
        <br />
        <textarea maxLength={150} placeholder="Add your comment" />
        <section className={reviewStyles.buttonContainer}>
          <button>Cancel</button>
          <button>Post</button>
        </section>
      </section>
    </section>
  )
}

const data = [
  {
    recommendation: "Highly Recommended",
    rating: 5,
    comment:
      "This restaurant is a really well serving space and personally felt highly suitable for friends gatherings and family.",
    name: "Hanisha",
  },
  {
    recommendation: "Highly Recommended",
    rating: 4,
    comment: "Awesome treatment. It pulled out a nice date. Thanks.",
    name: "Chris",
  },
  {
    recommendation: "Highly Recommended",
    rating: 5,
    comment:
      "I went up for a meet with my clients, they had immediate arrangements made for such ocassions.",
    name: "Karan",
  },
  {
    recommendation: "Highly Recommended",
    rating: 4,
    comment:
      "Creative outlook. Hoping to revisit. The billing took a little time, but thats totally fine",
    name: "Azeem",
  },
]

export default Review
