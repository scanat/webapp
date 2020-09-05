import React, { useEffect } from "react"
import Home from './components/home'
import Container from './components/layout'
import {navigate} from 'gatsby'

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
