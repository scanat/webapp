import React, { useState, useEffect } from "react"
import Card from "./card"
import styled from "styled-components"
import { QRCode } from "react-qrcode-logo"
import { navigate } from "gatsby"

const activeLayoutImage = require(`../../../images/basic-linear-layout.png`)
const scanatlogo = require(`../../../images/scan_at_logo.png`)

const Home = () => {
  const [qrActive, setQrActive] = useState(false)
  const [orgActiveUrl, setOrgActiveUrl] = useState("")

  const redirectToLayout = () => {
    navigate("/admin/linear-layout")
  }

  useEffect(() => {
    qrActive && generateQrCode()
  }, [qrActive])

  const generateQrCode = () => {
    if (typeof window !== "undefined") {
      const orgName = JSON.parse(localStorage.getItem("userData"))
        .organizationName
      const number = JSON.parse(localStorage.getItem("userData")).phoneNumber
      const no1 = number.slice(0, 5)
      const no2 = number.slice(5, 10)
      const rno1 = no1.split("").reverse().join("")
      const rno2 = no2.split("").reverse().join("")
      const orgUrl = rno2 + "-" + orgName + "-" + rno1

      setQrActive(true)
      setOrgActiveUrl(orgUrl)
    }
  }

  const redirectToActiveDisplay = () => {
    navigate(`/org-display?org=${orgActiveUrl}`)
  }

  return (
    <Container>
      <ContentTopic>Current Active Layout</ContentTopic>

      <Card>
        <img
          alt="Current Active Layout Temp"
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
          <ActiveOptionButton type="button" onClick={redirectToActiveDisplay}>
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
      <div id="qr_Code"></div>
      {qrActive && (
        <QRCode
          value={
            "https://master.d1ayuau7uprrnd.amplifyapp.com/org-display?org=" +
            orgActiveUrl
          }
          size={270}
          logoImage={scanatlogo}
          logoWidth={80}
          qrStyle="dots"
          enableCORS={true}
          ecLevel="H"
        />
      )}
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
  `

export default Home
