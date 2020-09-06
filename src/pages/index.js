import React, { useEffect } from "react"
import Container from "../components/layout"
import Banner from "../components/main/banner"
import ModuleNavigation from "../components/main/moduleNavigation"
import ScanAtWorks from "../components/main/scanatworks"
import ClientReview from '../components/main/clientreview'

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
