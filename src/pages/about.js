import React, { useEffect } from "react"
import Container from "../components/layout"
import Banner from "../components/main/banner"
import ScanAtWorks from "../components/main/scanatworks"
import ClientReview from "../components/main/clientreview"
import { navigate } from "gatsby"

const AboutPage = () => {
  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const org = urlParams.get("org")
    const pn = urlParams.get("pn")
    if(org !== null && pn !== null){
      navigate('/live/org-display?'+urlParams)
    }
  }, [])

  return (
    <Container>
      <Banner />
      <ScanAtWorks />
      <ClientReview />
    </Container>
  )
}

export default AboutPage
