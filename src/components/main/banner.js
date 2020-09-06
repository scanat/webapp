import React from 'react'
import BannerStyles from './banner.module.css'
import BannerVideo from '../../images/homebanner.mp4'

const Banner = () => {
    return(
        <section className={BannerStyles.container}>
            <video className={BannerStyles.videoBanner} width='100%' height='50%' autoPlay loop>
            <source src={BannerVideo} type="video/mp4"/>
            </video>
        </section>
    )
}

export default Banner