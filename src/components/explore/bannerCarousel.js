import React from "react"
import bannerCStyles from "./bannerCarousel.module.css"
import BackgroundSlider from "gatsby-image-background-slider"
import { graphql, useStaticQuery } from "gatsby"

const BannerCarousel = () => {
  return (
    <BackgroundSlider
      query={useStaticQuery(graphql`
        query {
          backgrounds: allFile(
            filter: { sourceInstanceName: { eq: "backgrounds" } }
          ) {
            nodes {
              relativePath
              childImageSharp {
                fluid(maxWidth: 1920, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      `)}
      initDelay={2}
      transition={4}
      duration={8}
      images={["innerbanner1.jpg", "innerbanner2.jpg"]}
      style={{
        width: "100%",
        height: "max-content",
      }}
    />
  )
}

export default BannerCarousel
