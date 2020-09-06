import React, { useEffect } from 'react'
import BannerStyles from './banner.module.css'
import BannerVideo from '../../images/homebanner.mp4'

const Banner = () => {
    useEffect(() => {
        document.getElementById('video').play()
    }, [])
    return(
        <section className={BannerStyles.container}>
            <video id="video" className={BannerStyles.videoBanner} autoPlay loop>
            <source src={BannerVideo} type="video/mp4" />
            </video>
        </section>
    )
}

export default Banner