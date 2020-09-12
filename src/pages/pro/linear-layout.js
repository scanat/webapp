import React, { useEffect } from "react"
import styled from "styled-components"
import BasicSystem from "./components/card-input-layouts/basic"
import Layout from "../../components/layout"

const LinearLayout = () => {

  return (
    <Layout>
      <Container>
        <BasicSystem />
      </Container>
    </Layout>
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
