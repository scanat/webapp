import React from "react"
import styled from "styled-components"
import {graphql} from 'gatsby'
import Img from 'gatsby-image'

const WelcomeScreen = (props, {data}) => {
  return (
    <Container>
      <WelcomeText>Scan At welcomes you</WelcomeText>

      <section
        style={{
          marginTop: "20vh",
          textAlign: "center",
        }}
      >
        <img alt="jkn" src={require('../images/scan_at_logo.png')} style={{width: '80px'}} />
      </section>
    </Container>
  )
}

export const query = graphql`
  query{
    file(relativePath: {eq: "../images/scan_at_logo.png"}){
      childImageSharp{
        fixed(width: 100){
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

const Container = styled.section`
    margin-top: ${window.innerWidth <= 992 && '50px'};
    width: 100%;
    height: 90vh;
  `,
  WelcomeText = styled.h3`
    text-align: center;
    margin-top: 50px;
  `

export default WelcomeScreen
