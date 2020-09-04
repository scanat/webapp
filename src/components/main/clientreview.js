import React from 'react'
import clientReviewStyles from './clientreview.module.css'
import  {faStar} from '@fortawesome/free-solid-svg-icons'

const CardLayout = () => {
    return(
        <section className={clientReviewStyles.cardContainer}>

        </section>
    )
}

const ClientReview = () => {
    return(
        <section className={clientReviewStyles.container}>
            <section className={clientReviewStyles.bannerIntro}>
                <h1>Clients Review</h1>
                <h3>Explore Scan At through our friends all around</h3>
            </section>
            <section className={clientReviewStyles.reviewsContainer}>

            </section>
        </section>
    )
}

export default ClientReview