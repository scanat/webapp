import React, { useEffect } from "react"
import BannerStyles from "./banner.module.css"
import BannerImage from "../../images/bannerimage.jpg"
import Anime from 'animejs'

const Banner = () => {

    useEffect(() => {
        Anime({
            targets: document.getElementById('animatingBanner'),
            keyframes: [
                {
                    translateX: 0,
                    duration: 2000
                },
                {
                    translateX: [0, '-50%'],
                    duration: 2000
                },
                {
                    translateX: '-50%',
                    duration: 2000
                },
                {
                    translateX: ['-50%', 0],
                    duration: 2000
                },
                {
                    translateX: 0,
                    duration: 2000
                }
            ],
            autoplay: true,
            easing: 'easeInOutCubic',
            loop: true,
            direction: 'alternate'
        })
    })

  if (typeof window !== "undefined") {
    if (window.innerWidth >= 992) {
      return (
        <section className={BannerStyles.container}>
          <img src={BannerImage} style={{ width: "100%", float: "left" }} />
        </section>
      )
    } else {
      return (
        <section className={BannerStyles.container}>
          <img id='animatingBanner' src={BannerImage} style={{ width: "200%", float: "left" }} />
        </section>
      )
    }
  }
}

export default Banner
