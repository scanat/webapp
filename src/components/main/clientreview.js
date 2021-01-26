import React from "react"
import clientReviewStyles from "./clientreview.module.css"
import { faStar, faEllipsisH } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Carousel from "react-elastic-carousel"

const CardLayout = props => {
  return (
    <section key={props.id} className={clientReviewStyles.cardContainer}>
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
        <h1>Subscriber Reviews</h1>
        <h3>Explore Scan At through our network of mates</h3>
      </section>
      <section className={clientReviewStyles.reviewsContainer}>
        <Carousel
          itemsToShow={1}
          verticalMode={false}
          pagination={true}
          renderPagination={() => (
            <FontAwesomeIcon icon={faEllipsisH} size="lg" color="grey" />
          )}
          focusOnSelect={true}
          showArrows={false}
        >
          {reviews.map((element, index) => (
            <CardLayout
              key={index}
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
      "Its giving a great experience, plus its safe and smooth, goodwork!",
    author: "Chit Chaat Corner",
    profile:
      "https://www.irreverentgent.com/wp-content/uploads/2018/03/Awesome-Profile-Pictures-for-Guys-look-away2.jpg",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content: "Placing order in seconds, cool.",
    author: "Chit Chaat Corner",
    profile:
      "https://media.glamour.com/photos/5695aa8e93ef4b09520dfd8f/master/w_400%2Cc_limit/sex-love-life-2009-12-1207-01_profile_pic_li.jpg",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content: "Its a one stop shop i must say",
    author: "Chit Chaat Corner",
    profile: "",
  },
  {
    gist: "Highly Recommended",
    rating: 5,
    content: "Probably the best app, automating lifestyle.",
    author: "Chit Chaat Corner",
    profile: "",
  },
]
