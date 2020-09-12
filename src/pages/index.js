import React, { useEffect } from "react"
import Container from "../components/layout"
import Banner from "../components/main/banner"
import DownloadApp from "../components/main/downloadApp"
import ScanAtWorks from "../components/main/scanatworks"
import ClientReview from "../components/main/clientreview"
import { navigate } from "gatsby"

const IndexPage = () => {
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
      {/* <DownloadApp /> */}
    </Container>
  )
}

export default IndexPage
