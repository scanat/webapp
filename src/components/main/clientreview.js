import React from "react"
import clientReviewStyles from "./clientreview.module.css"
import { faStar, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CardLayout = props => {
  return (
    <section className={clientReviewStyles.cardContainer}>
      <FontAwesomeIcon
        className={clientReviewStyles.profilePic}
        icon={faUserCircle}
        color="#169188"
        size="8x"
      />
      <p className={clientReviewStyles.gist}>"{props.gist}"</p>
      <section className={clientReviewStyles.starContainer}>
        {props.rating >= 1 && <FontAwesomeIcon icon={faStar} color="#ffd700" />}
        {props.rating >= 2 && <FontAwesomeIcon icon={faStar} color="#ffd700" />}
        {props.rating >= 3 && <FontAwesomeIcon icon={faStar} color="#ffd700" />}
        {props.rating >= 4 && <FontAwesomeIcon icon={faStar} color="#ffd700" />}
        {props.rating === 5 && (
          <FontAwesomeIcon icon={faStar} color="#ffd700" />
        )}
      </section>
      <p className={clientReviewStyles.content}>{props.content}</p>
      <p className={clientReviewStyles.author}>~{props.author}</p>
    </section>
  )
}

const ClientReview = () => {
  return (
    <section className={clientReviewStyles.container}>
      <section className={clientReviewStyles.bannerIntro}>
        <h1>Clients Review</h1>
        <h3>Explore Scan At through our network of mates</h3>
      </section>
      <section className={clientReviewStyles.reviewsContainer}>
        {reviews.map(element => (
          <CardLayout
            rating={element.rating}
            gist={element.gist}
            content={element.content}
            author={element.author}
          />
        ))}
      </section>
    </section>
  )
}

export default ClientReview

let reviews = [
  {
    gist: "Highly Recommended",
    rating: 5,
    content:
      "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet",
    author: "Chit Chaat Corner",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content:
      "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet",
    author: "Chit Chaat Corner",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content:
      "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet",
    author: "Chit Chaat Corner",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content:
      "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet",
    author: "Chit Chaat Corner",
  },
]
