import React, { useEffect } from "react"
import Container from "../components/layout"
import Banner from "../components/main/banner"
import ScanAtWorks from "../components/main/scanatworks"
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
    </Container>
  )
}

export default AboutPage
