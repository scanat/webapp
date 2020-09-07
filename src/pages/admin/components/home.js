import React, { useState, useEffect } from "react"
import { QRCode } from "react-qrcode-logo"
import { navigate, Link } from "gatsby"
import homeStyles from "./home.module.css"
import { faEdit, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"
import { faQrcode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getCurrentUser } from "../../../utils/subsAuth"

const activeLayoutImage = require(`../../../images/basic-linear-layout.png`)
const scanatlogo = require(`../../../images/scan_at_logo.png`)

const Card = ({ children }) => {
  return <section className={homeStyles.card}>{children}</section>
}

const Home = () => {
  const [userData, setUserData] = useState()
  const [qrActive, setQrActive] = useState(false)
  const [orgActiveUrl, setOrgActiveUrl] = useState("")

  const redirectToLayout = () => {
    navigate("/admin/linear-layout")
  }

  useEffect(() => {
    qrActive && generateQrCode()
  }, [qrActive])

  // useEffect(() => {
  //   setUserData(JSON.parse(localStorage.getItem("subscriberData")))
  // }, [])

  const generateQrCode = () => {
    if (typeof window !== "undefined") {
      const orgName = getCurrentUser().organizationName
      const number = getCurrentUser().phoneNumber
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
    <section className="homeContainer">
      <h3 className={homeStyles.contentTopic}>Current Active Layout</h3>

      <section className={homeStyles.activeLayoutController}>
        <Card>
          <img
            alt="Current Active Layout Temp"
            src={activeLayoutImage}
            onClick={redirectToLayout}
          />
          <h4 className={homeStyles.layoutName}>{getCurrentUser().organizationName}</h4>
        </Card>

        <section className={homeStyles.layoutControllerContainer}>
          <button
            className={homeStyles.activeOptionButton}
            type="button"
            onClick={redirectToLayout}
          >
            <FontAwesomeIcon
              icon={faEdit}
              size="lg"
              style={{ margin: "0 auto" }}
              color="white"
            />
          </button>
          <button
            className={homeStyles.activeOptionButton}
            type="button"
            onClick={
              qrActive
                ? redirectToActiveDisplay
                : () => alert("Generate QR code to view")
            }
            style={{ background: !qrActive && "grey" }}
          >
            {!qrActive ? (
              <FontAwesomeIcon
                icon={faEyeSlash}
                size="lg"
                style={{ margin: "0 auto" }}
                color="white"
              />
            ) : (
              <FontAwesomeIcon
                icon={faEye}
                size="lg"
                style={{ margin: "0 auto" }}
                color="white"
              />
            )}
          </button>
          <button
            className={homeStyles.activeOptionButton}
            type="button"
            onClick={generateQrCode}
            disabled={qrActive && true}
            style={{ background: qrActive && "grey" }}
          >
            <FontAwesomeIcon
              icon={faQrcode}
              size="2x"
              style={{ margin: "0 auto" }}
              color="white"
            />
          </button>
        </section>
      </section>

      <p className={homeStyles.threeStepText}>
        Modify - Generate QR - View Live
      </p>

      <section className={homeStyles.qrCodeSection}>
        {qrActive && (
          <>
            <h3 className={homeStyles.contentTopic}>
              <u>QR Code</u>
            </h3>
            <QRCode
              value={
                "https://master.d1o0chnm4q8480.amplifyapp.com?org=" +
                orgActiveUrl
              }
              size={250}
              logoImage={scanatlogo}
              logoWidth={80}
              qrStyle="dots"
              enableCORS={true}
              ecLevel="H"
            />
          </>
        )}
      </section>
    </section>
  )
}

export default Home
