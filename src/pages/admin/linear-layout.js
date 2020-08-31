import React, { useEffect } from "react"
import styled from "styled-components"
import BasicSystem from "./components/card-input-layouts/basic"
import { navigate } from "gatsby"

const LinearLayout = () => {

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
      <OrganizationTitle>Chit Chaat Corner</OrganizationTitle>

      <BasicSystem />
    </Container>
  )
}

const OrganizationTitle = styled.h2`
    color: #f98a47;
  `,
  Container = styled.section`
    position: relative;
    float: left;
    width: 100%;
    height: 100vh;
    text-align: center;
    margin: 0;
    display: flex;
    flex-direction: column;
  `

export default LinearLayout
