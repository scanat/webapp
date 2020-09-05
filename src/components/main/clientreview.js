import React from "react"
import clientReviewStyles from "./clientreview.module.css"
import { faStar, faUser } from "@fortawesome/free-solid-svg-icons"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const CardLayout = () => {
  return <section className={clientReviewStyles.cardContainer}>
      
  </section>
}

const ClientReview = () => {
  return (
    <section className={clientReviewStyles.container}>
      <section className={clientReviewStyles.bannerIntro}>
        <h1>Clients Review</h1>
        <h3>Explore Scan At through our friends all around</h3>
      </section>
      <section className={clientReviewStyles.reviewsContainer}>
        <Carousel>
          <div>
            <img src="assets/1.jpeg" />
            <p className="legend">Legend 1</p>
          </div>
          <div>
            <img src="assets/2.jpeg" />
            <p className="legend">Legend 2</p>
          </div>
          <div>
            <img src="assets/3.jpeg" />
            <p className="legend">Legend 3</p>
          </div>
        </Carousel>
      </section>
    </section>
  )
}

export default ClientReview
