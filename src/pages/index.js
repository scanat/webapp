import React from "react"
import Container from '../components/layout'
import indexStyles from './index.module.css'

const banner = require("../images/scanat-banner.jpg")

const IndexPage = () => {

  return (
    <Container>
      <img className={indexStyles.bannerImage} src={banner} alt="Scan At Banner" />
    </Container>
  )
}

export default IndexPage
