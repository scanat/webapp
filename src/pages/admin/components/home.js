import React, { useState, useEffect } from "react"
import Card from "./card"
import styled from "styled-components"
import QRCodeWithLogo from "qrcode-with-logos"

const activeLayoutImage = require(`../../../images/basic-linear-layout.png`)
const scanatlogo = require(`../../../images/scan_at_logo.png`)

const Home = () => {
  const [qrActive, setQrActive] = useState(false)

  const redirectToLayout = () => {
    window.location.href = `http://localhost:8000/admin/linear-layout`
  }

  useEffect(() => {
    qrActive && generateQrCode()
  }, [])

  const generateQrCode = () => {
    const orgName = JSON.parse(localStorage.getItem("userData")).organizationName
    const number = JSON.parse(localStorage.getItem("userData")).phoneNumber
    const no1 = number.slice(0, 5)
    const no2 = number.slice(5, 10)
    const rno1 = no1.split("").reverse().join("")
    const rno2 = no2.split("").reverse().join("")
    const orgUrl = rno2 + "-" + orgName +"-"+ rno1

    document.getElementById("canvas").style.display = "flex"

    new QRCodeWithLogo({
      canvas: document.getElementById("qrcodeCanvas"),
      content: "http://localhost:8000/org-display?org=" + orgUrl,
      width: 300,
      canvas: document.getElementById("canvas"),
      logo: {
        src: scanatlogo,
      },
    }).toCanvas()
    setQrActive(true)

    window.location.href = "http://localhost:8000/org-display?org=" + orgUrl
  }

  return (
    <Container>
      <ContentTopic>Current Active Layout</ContentTopic>

      <Card>
        <img
          alt="Current Active Layout Temp Image"
          src={activeLayoutImage}
          onClick={redirectToLayout}
        />
        <section
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            WebkitFlexDirection: "column",
            msFlexDirection: "column",
            margin: "0 5px",
          }}
        >
          <ActiveOptionButton type="button" onClick={redirectToLayout}>
            Modify Page
          </ActiveOptionButton>
          <ActiveOptionButton type="button">
            {!qrActive ? <strike>View my page</strike> : "View my Page"}
          </ActiveOptionButton>
          <ActiveOptionButton
            type="button"
            onClick={!qrActive && generateQrCode}
          >
            {qrActive ? <strike>Activate QR Code</strike> : "Activate QR Code"}
          </ActiveOptionButton>
          <LayoutName>Basic Linear Layout</LayoutName>
        </section>
      </Card>
      <QrCanvas id="canvas"></QrCanvas>
    </Container>
  )
}

const Container = styled.section`
    width: 100%;
    background: transparent;
    text-align: center;
    margin-top: 60px;
  `,
  ContentTopic = styled.h3`
    margin: 20px 0;
    color: #f3d200;
  `,
  ActiveOptionButton = styled.button`
    margin: 5px 0;
  `,
  LayoutName = styled.h4`
    text-decoration: underline;
    color: #169188;
  `,
  QrCanvas = styled.canvas`
    display: none;
    margin: 0 auto;
  `

export default Home
