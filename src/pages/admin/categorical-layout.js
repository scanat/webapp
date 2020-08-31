import React from "react"
import styled from "styled-components"
import CategoryBasicSystem from "./components/card-input-layouts/category-basic"

const CategoricalLayout = () => {
  return (
    <Container>
      <OrganizationTitle>Chit Chaat Corner</OrganizationTitle>

      <CategoryBasicSystem />
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

export default CategoricalLayout
