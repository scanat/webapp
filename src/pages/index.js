import React from "react"
import Container from '../components/layout'
import indexStyles from './index.module.css'
import Banner from '../components/main/banner'
import SearchPanel from '../components/main/search'

const banner = require("../images/scanat-banner.jpg")

const IndexPage = () => {

  return (
    <Container>
      <Banner />
      <SearchPanel />
      <img className={indexStyles.bannerImage} src={banner} alt="Scan At Banner" />
    </Container>
  )
}

export default IndexPage
