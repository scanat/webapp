import React, { useEffect, useState } from "react"
import Container from "../components/layout"
import Banner from "../components/main/banner"
import DownloadApp from "../components/main/downloadApp"
import ScanAtWorks from "../components/main/scanatworks"
import ClientReview from "../components/main/clientreview"
import Loader from "../components/loader"

const IndexPage = () => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.onreadystatechange = () => {
      document.readyState !== "complete" ? setLoading(true) : setLoading(false)
    }
  }, [])

  return (
    <Container>
      {loading && <Loader></Loader>}
      <Banner />
      <ScanAtWorks />
      <ClientReview />
      {/* <DownloadApp /> */}
    </Container>
  )
}

export default IndexPage
