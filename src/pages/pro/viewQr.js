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
      setNoQrs(JSON.parse(res.data.qr))
    } catch (error) {
      switchContent("No data found", false)
      setNoQrs(null)
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
          <p className={viewQrStyles.desc}>You can left click or long press on individual QR codes to save the images</p>
            <section className={viewQrStyles.qrGridContainer}>
              {[...Array(noQrs)].map((element, index) => (
                <Card>
                  <QRCode
                    value={`${liveUrl}${getCurrentUser().website}&id=${index+1}`}
                    size={150}
                    // logoImage={scanatlogo}
                    // logoWidth={80}
                    qrStyle="dots"
                    enableCORS={true}
                    ecLevel="H"
                  />
                  <p>QR Index - {index+1}</p>
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
