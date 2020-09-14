import React, { useEffect, useState } from "react"
import qrStyles from "./qrCodes.module.css"
import Layout from "../../components/layout"
import { QRCode } from "react-qrcode-logo"
import { getCurrentUser } from "../../utils/auth"
import axios from "axios"
import SnackBar from "../../components/snackBar"
import config from "../../config.json"
import { navigate, Link } from "gatsby"

import scanatlogo from "../../images/scan_at_logo.png"

const QrCodes = () => {
  const [portfolioUrl, setPortfolioUrl] = useState()
  const [noQrs, setNoQrs] = useState(1)
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

  useEffect(() => {
    setPortfolioUrl(
      `https://www.scanat.in/portfolio${getCurrentUser().website}`
    )
    getSubscribersQrs()
  }, [])

  const downloadHomeQr = () => {
    if (typeof window !== "undefined") {
      var canvas = document.querySelectorAll("#react-qrcode-logo")
      document
        .getElementById("downloadHomeLink")
        .setAttribute("href", canvas[1].toDataURL("image/png"))
    }
  }

  const getSubscribersQrs = async () => {
    try {
      const params = JSON.stringify({
        phoneNumber: getCurrentUser().phone_number,
      })
      const res = await axios.post(
        `${config.invokeUrl}/getsubscriberqr`,
        params
      )
      switchContent(res.data.msg, true)
      if (typeof JSON.parse(res.data.qr) === "number") {
        if (typeof window !== "undefined") {
          document.getElementById("qrInput").value = JSON.parse(res.data.qr)
        }
        setNoQrs(JSON.parse(res.data.qr))
      }
    } catch (error) {
      switchContent("No data found", false)
    }
  }

  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  const generateSeqQrs = async () => {
    try {
      const params = JSON.stringify({
        phoneNumber: getCurrentUser().phone_number,
        qr: noQrs,
      })
      const res = await axios.post(
        `${config.invokeUrl}/putsubscriberqr`,
        params
      )
      switchContent(res.data.msg, true)
    } catch (error) {
      switchContent(error.message, false)
    }
  }

  return (
    <Layout>
      <section className={qrStyles.container}>
        <h1 className={qrStyles.topic}>My Portfolio QR</h1>
        <a
          className={qrStyles.downloadLink}
          id="downloadHomeLink"
          download={getCurrentUser().name + " Portfolio QR"}
          onClick={downloadHomeQr}
        >
          <u>Download QR Code</u>
        </a>
        <section className={qrStyles.qrHolder}>
          <QRCode
            value={portfolioUrl}
            size={250}
            logoImage={scanatlogo}
            logoWidth={80}
            qrStyle="dots"
            enableCORS={true}
            ecLevel="H"
          />

          <section hidden>
            <QRCode
              value={portfolioUrl}
              size={500}
              logoImage={scanatlogo}
              logoWidth={100}
              qrStyle="dots"
              enableCORS={true}
              ecLevel="H"
            />
          </section>

          <button
            className={qrStyles.generateButton}
            type="button"
            onClick={() => navigate("/pro/viewQr")}
          >
            View my {noQrs} generated QRs
          </button>
        </section>
        <h1 className={qrStyles.topic}>Generate QRs</h1>
        <section className={qrStyles.generateQrSection}>
          <label>Enter number of QR codes</label>
          <input
            id="qrInput"
            className={qrStyles.input}
            placeholder={noQrs}
            minLength="1"
            min={1}
            maxLength="3"
            max={999}
            inputMode="tel"
            type="number"
            onChange={event => setNoQrs(event.target.value)}
          />
          <button
            className={qrStyles.generateButton}
            type="submit"
            onClick={generateSeqQrs}
          >
            Generate {noQrs} sequential QRs
          </button>
          <hr /> OR <hr />
          <button className={qrStyles.generateButton} type="button">
            Generate custom QRs *
          </button>
        </section>

        <p className={qrStyles.infoText}>
          * - You can generate QRs with custom identity numbers.
          <br />
          Eg. Table Numbers [101, 102, 103, 201, 202, 203 ...] and so on
        </p>
      </section>

      {snackContent && <SnackBar message={snackContent} err={snackError} />}
    </Layout>
  )
}

export default QrCodes
