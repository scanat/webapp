import React from "react"
import Container from "../components/layout"
import indexStyles from "./index.module.css"
import Banner from "../components/main/banner"
import ModuleNavigation from "../components/main/moduleNavigation"
import ScanAtWorks from "../components/main/scanatworks"
import ClientReview from '../components/main/clientreview'
const banner = require("../images/scanat-banner.jpg")

const IndexPage = () => {
  return (
    <Container>
      <Banner />
      <ScanAtWorks />
      <ClientReview />
      <ModuleNavigation />
    </Container>
  )
}

export default IndexPage
