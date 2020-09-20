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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMinusSquare,
  faPlusSquare,
} from "@fortawesome/free-regular-svg-icons"

const QrCodes = () => {
  const [portfolioUrl, setPortfolioUrl] = useState()
  const [noQrs, setNoQrs] = useState(1)
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)
  const [openCustom, setOpenCustom] = useState(false)
  const [customNum, setCustomNum] = useState("")
  const [roomNumber, setRoomNumber] = useState([])

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
      let data = res.data.qr
      if(typeof data === "object"){
        setNoQrs(data.length)
        setRoomNumber(data)
      }
      switchContent(res.data.msg, true)
      if (typeof JSON.parse(res.data.qr) !== "object") {
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

  const generateCustomQrs = async () => {
    try {
      const params = JSON.stringify({
        phoneNumber: getCurrentUser().phone_number,
        qr: roomNumber,
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

  const addCustomNumber = () => {
    if (customNum.length > 0) {
      if (!roomNumber.includes(customNum)) {
        roomNumber.push(customNum)
      }else{
        switchContent("Number already exists.", false)
      }
    } else {
      switchContent("Oops", false)
    }

    setRoomNumber(roomNumber)
  }

  const reduceCustomNumber = () => {
    if (customNum.length > 0) {
      if (roomNumber.includes(customNum)) {
        const tempList = [...roomNumber]
        const index = tempList.indexOf(customNum)
        tempList.splice(index, 1)
      } else {
        switchContent("Number does not exist.", false)
      }
    } else {
      switchContent("Oops", false)
    }
    setRoomNumber(roomNumber)
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
          <section className={qrStyles.customContainer}>
            <button
              className={qrStyles.iconButton}
              type="button"
              onClick={reduceCustomNumber}
            >
              <FontAwesomeIcon icon={faMinusSquare} size="3x" color="#db2626" />
            </button>
            <input
              style={{ padding: "5px" }}
              type="text-area"
              onChange={e => String(setCustomNum(e.target.value)).toString()}
              placeholder="101, 102, ..."
            />
            <button
              className={qrStyles.iconButton}
              type="button"
              onClick={addCustomNumber}
            >
              <FontAwesomeIcon icon={faPlusSquare} size="3x" color="#169188" />
            </button>
          </section>
          <p style={{margin: '5px 20px', textAlign: "center"}}>{roomNumber + " "}</p>
        </section>
        <section>
          <button
            className={qrStyles.generateButton}
            type="button"
            onClick={generateCustomQrs}
            disabled={roomNumber.length>0 ? false : true}
          >
            Generate {roomNumber.length} custom QRs *
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
