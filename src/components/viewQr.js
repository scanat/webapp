import React, { useEffect, useState } from "react"
import viewQrStyles from "./viewQr.module.css"
import { QRCode } from "react-qrcode-logo"
import { getCurrentUser } from "../utils/auth"
import { Link } from "gatsby"
import Sticker from "../images/sticker.png"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import awsmobile from "../aws-exports"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

Amplify.configure(awsmobile)

const Card = ({ children }) => {
  return <section className={viewQrStyles.card}>{children}</section>
}

const ViewQr = (props, { location }) => {
  const [noQrs, setNoQrs] = useState()
  const [arrQrs, setArrQrs] = useState([])
  const liveUrl = "https://www.scanat.in/portfolio/?id="

  const downloadDynamicQrs = () => {
    if (noQrs !== "undefined")
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
    if (arrQrs.length > 0)
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
          var fileName = getCurrentUser()["custom:page_id"] + " " + index
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
    <section className={viewQrStyles.container}>
      <FontAwesomeIcon
        icon={faTimes}
        size="lg"
        style={{ position: "absolute", right: 15, top: 15 }}
        onClick={props.alterViewQr}
      />
      {!props.seqQr && !props.customQr && (
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
      {props.seqQr && (
        <>
          <p className={viewQrStyles.topic}>Sequential QR's</p>
          <a
            className={viewQrStyles.downloadLink}
            id="downloadHomeLink"
            download={getCurrentUser()["custom:page_id"] + " QR"}
            onClick={downloadDynamicQrs} //Download All Seq QRs
          >
            <u>Download All QR Codes</u>
          </a>
          <section className={viewQrStyles.qrGridContainer}>
            {[...Array(parseInt(props.seqQr)).keys()].map((element, index) => (
              <Card>
                <QRCode
                  value={`${liveUrl}${
                    getCurrentUser()["custom:page_id"]
                  }&key=${index+1}`}
                  size={100}
                  qrStyle="dots"
                  enableCORS={true}
                  ecLevel="H"
                />
                <section id="downloadableQrs" hidden>
                  <QRCode
                    value={`${liveUrl}${
                      getCurrentUser()["custom:page_id"]
                    }&key=${index+1}`}
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

      {props.customQr && (
        <>
          <p className={viewQrStyles.topic}>Custom QR's</p>
          <a
            className={viewQrStyles.downloadLink}
            id="downloadHomeLink"
            download={getCurrentUser()["custom:page_id"] + " QR"}
            onClick={downloadDynamicQrs} //Download All Custom QRs
          >
            <u>Download All QR Codes</u>
          </a>
          <section className={viewQrStyles.qrGridContainer}>
            {props.customQr.map((element, index) => (
              <Card>
                <QRCode
                  value={`${liveUrl}${
                    getCurrentUser()["custom:page_id"]
                  }&key=${index+1}`}
                  size={134}
                  qrStyle="dots"
                  enableCORS={true}
                  ecLevel="H"
                />
                <section id="downloadableQrs" hidden>
                  <QRCode
                    value={`${liveUrl}${
                      getCurrentUser()["custom:page_id"]
                    }&key=${index+1}`}
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
    </section>
  )
}

export default ViewQr
