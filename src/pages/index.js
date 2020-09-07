import React, { useEffect } from "react"
import Container from "../components/layout"
import Banner from "../components/main/banner"
import ModuleNavigation from "../components/main/moduleNavigation"
import ScanAtWorks from "../components/main/scanatworks"
import ClientReview from "../components/main/clientreview"
import { Router } from "@reach/router"
import Profile from "./profile"
import OrgDisplay from "./org-display"

const IndexPage = () => {
  return (
    <Container>
      <Router basepath="/app">
        <Profile path="/profile" />
        <OrgDisplay path="/org-display" />
      </Router>
      <Banner />
      <ScanAtWorks />
      <ClientReview />
      {/* <ModuleNavigation /> */}
    </Container>
  )
}

export default IndexPage
