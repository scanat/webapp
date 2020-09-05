import React from "react"
import Container from "../components/layout"
import Banner from "../components/main/banner"
import ModuleNavigation from "../components/main/moduleNavigation"
import ScanAtWorks from "../components/main/scanatworks"
import ClientReview from '../components/main/clientreview'
import Amplify from 'aws-amplify'
import config from '../config.json'

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
})

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
