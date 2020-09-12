import React from "react"
import styled from "styled-components"
import CategoryBasicSystem from "./components/card-input-layouts/category-basic"
import Layout from "../../components/layout"

const CategoricalLayout = () => {
  return (
    <Layout>
      <Container>
        <CategoryBasicSystem />
      </Container>
    </Layout>
  )
}

const Container = styled.section`
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
