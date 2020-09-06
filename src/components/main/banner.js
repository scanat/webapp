import React, { useEffect, useState } from "react"
import BannerStyles from "./banner.module.css"
import BannerImage from "../../images/bannerimage.jpg"
import Anime from "animejs"

const Banner = () => {
  const [smallScreen, setSmallScreen] = useState()

  useEffect(() => {
    if (typeof window !== "undefined" ? true : false) {
      window.innerWidth < 992 ? setSmallScreen(true) : setSmallScreen(false)
    }
    console.log(smallScreen)
    Anime({
      targets: document.getElementById("animatingBanner"),
      keyframes: [
        {
          translateX: 0,
          duration: 2000,
        },
        {
          translateX: [0, "-50%"],
          duration: 2000,
        },
        {
          translateX: "-50%",
          duration: 2000,
        },
        {
          translateX: ["-50%", 0],
          duration: 2000,
        },
        {
          translateX: 0,
          duration: 2000,
        },
      ],
      autoplay: true,
      easing: "easeInOutCubic",
      loop: true,
      direction: "alternate",
    })
  })

  return (
    <section className={BannerStyles.container}>
      {smallScreen ? (
        <img
          id="animatingBanner"
          src={BannerImage}
          style={{ width: "200%", float: "left" }}
        />
      ) : (
        <img src={BannerImage} style={{ width: "100%", float: "left" }} />
      )}
    </section>
  )
}

export default Banner
