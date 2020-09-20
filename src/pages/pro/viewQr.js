import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import viewQrStyles from "./viewQr.module.css"
import Layout from "../../components/layout"
import { QRCode, IProps } from "react-qrcode-logo"
import { getCurrentUser } from "../../utils/auth"
import axios from "axios"
import SnackBar from "../../components/snackBar"
import config from "../../config.json"
import { navigate, Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCaretLeft,
  faCaretSquareLeft,
} from "@fortawesome/free-solid-svg-icons"
import Sticker from "../../images/sticker.png"

const Card = ({ children }) => {
  return <section className={viewQrStyles.card}>{children}</section>
}

const ViewQr = () => {
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)
  const [noQrs, setNoQrs] = useState()
  const [arrQrs, setArrQrs] = useState([])
  const liveUrl = "https://www.scanat.in/live/org-display"

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  useEffect(() => {
    getSubscribersQrs()
  }, [])

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
      if (typeof res.data.qr === "number") setNoQrs(JSON.parse(res.data.qr))
      if (typeof res.data.qr === "object") setArrQrs(res.data.qr)
      console.log(noQrs)
    } catch (error) {
      switchContent("No data found", false)
      setNoQrs(null)
    }
  }

  const downloadDynamicQrs = () => {
    if(noQrs!== 'undefined')
    for (let j = 0; j < noQrs; j++) {
      let p = new Promise((resolve, reject) => {
        var image = new Image()
        image.src = Sticker

        var qr = new Image()
        qr.src = document
          .querySelectorAll("#downloadableQrs #react-qrcode-logo")
          [j].toDataURL("image/png")

        qr.onload = () => {
          var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d")
          canvas.width = 648
          canvas.height = 432

          ctx.drawImage(image, 0, 0, 648, 432)
          ctx.drawImage(qr, 240, 30, 380, 380)

          downloadAllQr(canvas.toDataURL("image/png"), j)
        }
      })
    }
    if(arrQrs.length > 0)
    for (let j = 0; j < arrQrs.length; j++) {
      let p = new Promise((resolve, reject) => {
        var image = new Image()
        image.src = Sticker

        var qr = new Image()
        qr.src = document
          .querySelectorAll("#downloadableQrs #react-qrcode-logo")
          [j].toDataURL("image/png")

        qr.onload = () => {
          var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d")
          canvas.width = 648
          canvas.height = 432

          ctx.drawImage(image, 0, 0, 648, 432)
          ctx.drawImage(qr, 240, 30, 380, 380)

          downloadAllQr(canvas.toDataURL("image/png"), j)
        }
      })
    }
  }

  const downloadAllQr = async (dUrl, index) => {
    if (typeof window !== "undefined") {
      await fetch(dUrl)
        .then(resp => resp.blob())
        .then(blob => {
          var fileName = getCurrentUser().name + " " + index
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.style.display = "none"
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
        .catch(() => {})
    }
  }

  return (
    <Layout>
      <section className={viewQrStyles.container}>
        {typeof noQrs === null && (
          <section>
            <h3 className={viewQrStyles.topic}>
              Oops seems like you do not have any generated QRs available yet
            </h3>
            <p className={viewQrStyles.desc}>
              To view your Portfolio Page QR and generate more <br />
              Visit <Link to="/pro/qrCodes">here</Link>
            </p>
          </section>
        )}
        {typeof noQrs === "number" && (
          <>
            <p className={viewQrStyles.desc}>
              You can left click on individual QR codes to save the images
            </p>
            <a
              className={viewQrStyles.downloadLink}
              id="downloadHomeLink"
              download={getCurrentUser().name + " QR"}
              onClick={downloadDynamicQrs}
            >
              <u>Download All QR Codes</u>
            </a>
            <section className={viewQrStyles.qrGridContainer}>
              {[...Array(noQrs)].map((element, index) => (
                <Card>
                  <QRCode
                    value={`${liveUrl}${getCurrentUser().website}&id=${index}`}
                    size={134}
                    qrStyle="dots"
                    enableCORS={true}
                    ecLevel="H"
                  />
                  <section id="downloadableQrs" hidden>
                    <QRCode
                      value={`${liveUrl}${
                        getCurrentUser().website
                      }&id=${index}`}
                      size={380}
                      qrStyle="dots"
                      enableCORS={true}
                      ecLevel="H"
                    />
                  </section>
                </Card>
              ))}
            </section>
          </>
        )}

        {typeof arrQrs === "object" && (
          <>
            <p className={viewQrStyles.desc}>
              You can left click on individual QR codes to save the images
            </p>
            <a
              className={viewQrStyles.downloadLink}
              id="downloadHomeLink"
              download={getCurrentUser().name + " QR"}
              onClick={downloadDynamicQrs}
            >
              <u>Download All QR Codes</u>
            </a>
            <section className={viewQrStyles.qrGridContainer}>
              {arrQrs.map((element, index) => (
                <Card>
                  <QRCode
                    value={`${liveUrl}${getCurrentUser().website}&id=${element}`}
                    size={134}
                    qrStyle="dots"
                    enableCORS={true}
                    ecLevel="H"
                  />
                  <section id="downloadableQrs" hidden>
                    <QRCode
                      value={`${liveUrl}${
                        getCurrentUser().website
                      }&id=${element}`}
                      size={380}
                      qrStyle="dots"
                      enableCORS={true}
                      ecLevel="H"
                    />
                  </section>
                </Card>
              ))}
            </section>
          </>
        )}
        {snackContent && <SnackBar message={snackContent} err={snackError} />}
      </section>
    </Layout>
  )
}

export default ViewQr
