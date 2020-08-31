import React, {useEffect} from "react"
import styled from "styled-components"
import BasicSystem from "./components/card-input-layouts/basic"

const LinearLayout = () => {

  useEffect(() => {
    if (
      !localStorage.getItem("loggedIn") ||
      localStorage.getItem("loggedIn") === null
    ) {
      window.location.href = `http://localhost:8000/admin/login`
    }
    console.log(JSON.parse(localStorage.getItem('userData')))
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
