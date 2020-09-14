import React, { useEffect, useState } from "react"
import viewQrStyles from "./viewQr.module.css"
import Layout from "../../components/layout"
import { QRCode } from "react-qrcode-logo"
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

const Card = ({ children }) => {
  return <section className={viewQrStyles.card}>{children}</section>
}

const ViewQr = () => {
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)
  const [noQrs, setNoQrs] = useState()
  const [qrId, setQrId] = useState()
  const [qrs, setQrs] = useState([])
  const liveUrl = "https://www.scanat.in/live/org-display"

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
    var canvas = document.querySelectorAll(
      "#downloadableQrs #react-qrcode-logo"
    )

    for (let i = 0; i < noQrs; i++) {
      qrs.push(canvas[i].toDataURL("image/png"))
    }
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
      setNoQrs(JSON.parse(res.data.qr))
    } catch (error) {
      switchContent("No data found", false)
      setNoQrs(null)
    }
  }

  const downloadAllQr = () => {
    if (typeof window !== "undefined") {
      qrs.map(async (dUrl, index) => {
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
      })
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
              download={getCurrentUser().name + " QR" + qrId}
              onClick={downloadAllQr}
            >
              <u>Download All QR Codes</u>
            </a>
            <section className={viewQrStyles.qrGridContainer}>
              {[...Array(noQrs)].map((element, index) => (
                <Card>
                  <QRCode
                    value={`${liveUrl}${getCurrentUser().website}&id=${index}`}
                    size={100}
                    qrStyle="dots"
                    enableCORS={true}
                    ecLevel="H"
                  />
                  <section id="downloadableQrs" hidden>
                    <QRCode
                      value={`${liveUrl}${
                        getCurrentUser().website
                      }&id=${index}`}
                      size={500}
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
