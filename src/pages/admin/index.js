import React, { useEffect } from "react"
import Home from './components/home'
import Container from '../../components/layout'
import {navigate} from 'gatsby'
import Amplify from 'aws-amplify'
import config from '../../config.json'

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID_ADMIN,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID_ADMIN
  }
})

const Index = () => {

  useEffect(() => {
    if (
      !localStorage.getItem("loggedIn") ||
      localStorage.getItem("loggedIn") === null
    ) {
      navigate('/admin/login')
    }
  })

  return (
    <Container>
      <Home />
    </Container>
  )
}

export default Index
