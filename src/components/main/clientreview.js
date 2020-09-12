import React from "react"
import clientReviewStyles from "./clientreview.module.css"
import { faStar, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Carousel from "react-elastic-carousel"

const CardLayout = props => {
  return (
    <section key={props.id} className={clientReviewStyles.cardContainer}>
      <section className={clientReviewStyles.profilePicContainer}>
        {props.profile !== "" ? (
          <img
            className={clientReviewStyles.picture}
            src={props.profile}
            alt="Profile Pic Scan At"
          />
        ) : (
          <FontAwesomeIcon
            className={clientReviewStyles.profilePic}
            icon={faUserCircle}
            color="#169188"
            size="8x"
          />
        )}
      </section>

      <p className={clientReviewStyles.gist}>{props.gist}</p>
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
        <Carousel
          itemsToShow={1}
          verticalMode={false}
          enableAutoPlay={true}
          pagination={false}
          autoPlaySpeed={5000}
          focusOnSelect={true}
        >
          {reviews.map((element, index) => (
            <CardLayout
              id={index}
              rating={element.rating}
              gist={element.gist}
              content={element.content}
              author={element.author}
              profile={element.profile}
            />
          ))}
        </Carousel>
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
    profile:
      "https://www.irreverentgent.com/wp-content/uploads/2018/03/Awesome-Profile-Pictures-for-Guys-look-away2.jpg",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content:
      "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet",
    author: "Chit Chaat Corner",
    profile:
      "https://media.glamour.com/photos/5695aa8e93ef4b09520dfd8f/master/w_400%2Cc_limit/sex-love-life-2009-12-1207-01_profile_pic_li.jpg",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content:
      "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet",
    author: "Chit Chaat Corner",
    profile: "",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content:
      "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet",
    author: "Chit Chaat Corner",
    profile: "",
  },
]
