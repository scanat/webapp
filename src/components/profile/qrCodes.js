import React, { useEffect, useRef, useState } from "react"
import qrStyles from "./qrCodes.module.css"
import Layout from "../layout"
import { QRCode } from "react-qrcode-logo"
import { getCurrentUser } from "../../utils/auth"
import { navigate } from "gatsby"
import scanatlogo from "../../images/scan_at_logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMinusSquare,
  faPlusSquare,
} from "@fortawesome/free-regular-svg-icons"
import {
  faFacebookF,
  faPinterestP,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"
import Amplify, { API, graphqlOperation } from "aws-amplify"
import awsmobile from "../../aws-exports"
import ViewQr from "../viewQr"

Amplify.configure(awsmobile)

const QrCodes = () => {
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [seqQr, setSeqQr] = useState(null)
  const [customQr, setCustomQr] = useState(null)
  const [viewQr, setViewQr] = useState(false)
  const seqQrRef = useRef(null)
  const customQrRef = useRef(null)
  const customQrNotice = useRef(null)

  useEffect(() => {
    setPortfolioUrl(
      `https://www.scanat.in/portfolio/?id=${getCurrentUser()["custom:page_id"]}`
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

  async function getSubscribersQrs() {
    try {
      let params = {
        id: getCurrentUser()["custom:page_id"],
      }
      await API.graphql(graphqlOperation(getSubscriber, params)).then(res => {
        setSeqQr(res.data.getSubscriber.seqQr)
        res.data.getSubscriber.customQr &&
          setCustomQr(res.data.getSubscriber.customQr)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const generateSeqQrs = async () => {
    try {
      const params = {
        input: {
          id: getCurrentUser()["custom:page_id"],
          seqQr: seqQrRef.current.value,
        },
      }
      await API.graphql(graphqlOperation(updateSubscriber, params)).then(res =>
        console.log(res)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const generateCustomQrs = async () => {
    try {
      const params = {
        input: {
          id: getCurrentUser()["custom:page_id"],
          customQr: customQr,
        },
      }
      await API.graphql(graphqlOperation(updateSubscriber, params)).then(res =>
        console.log(res)
      )
      navigate("/pro/qrCodes")
    } catch (error) {
      console.log(error)
    }
  }

  const addCustomNumber = () => {
    if (customQrRef.current.value !== "") {
      if (!customQr.includes(customQrRef.current.value)) {
        let temp = [...customQr]
        temp.push(customQrRef.current.value)
        setCustomQr(temp)
        customQrRef.current.value = ""
      } else {
        customQrNotice.current.innerHTML = "Oops custom qr already registered"
        setTimeout(() => {
          customQrNotice.current.innerHTML = ""
        }, 3000)
      }
    } else {
      customQrNotice.current.innerHTML = "Lets start with some custom IDs"
      setTimeout(() => {
        customQrNotice.current.innerHTML = ""
      }, 3000)
    }
  }

  const reduceCustomNumber = () => {
    if (customQrRef.current.value !== "") {
      if (customQr.includes(customQrRef.current.value)) {
        let temp = [...customQr]
        temp.splice(temp.indexOf(customQrRef.current.value), 1)
        setCustomQr(temp)
        customQrRef.current.value = ""
      } else {
        customQrNotice.current.innerHTML = "Oops qr does not exist"
        setTimeout(() => {
          customQrNotice.current.innerHTML = ""
        }, 3000)
      }
    } else {
      customQrNotice.current.innerHTML = "Lets start with some custom IDs"
      setTimeout(() => {
        customQrNotice.current.innerHTML = ""
      }, 3000)
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
            onClick={() => setViewQr(true)}
            style={{ background: "rgba(22, 145, 136, 1)", color: "whitesmoke" }}
          >
            View QRs
          </button>
          <section className={qrStyles.socialLinksContainer}>
            <a
              alt="Whatsapp"
              href={`https://wa.me/?text=Here is my portfolio, please visit and help me share more! https://scanat.in/portfolio${
                getCurrentUser().website
              }`}
              className={qrStyles.shareLink}
            >
              <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              <br />
              <label className={qrStyles.shareText}>WhatsApp</label>
            </a>

            <a
              alt="Twitter"
              href={`https://twitter.com/share?text=Here is my portfolio, please visit and help me share more!&url=https://scanat.in/portfolio${
                getCurrentUser().website
              }`}
              className={qrStyles.shareLink}
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
              <br />
              <label className={qrStyles.shareText}>Twitter</label>
            </a>

            <a
              alt="Facebook"
              href={`https://facebook.com/sharer.php?u=https%3A%2F%2Fscanat.in/portfolio${
                getCurrentUser().website
              }[title]=Here+is+my+portfolio,+please+visit+and+help+me+share+more!`}
              className={qrStyles.shareLink}
            >
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
              <br />
              <label className={qrStyles.shareText}>Facebook</label>
            </a>

            <a
              alt="Pinterest"
              href={`http://pinterest.com/pin/create/button/?url=${
                getCurrentUser().website
              }&description=Here+is+my+portfolio,+please+visit+and+help+me+share+more!`}
              className={qrStyles.shareLink}
            >
              <FontAwesomeIcon icon={faPinterestP} size="lg" />
              <br />
              <label className={qrStyles.shareText}>Pinterest</label>
            </a>
          </section>
        </section>
        <h1 className={qrStyles.topic}>Generate QRs</h1>
        <section className={qrStyles.generateQrSection}>
          <label>Enter number of QR codes</label>
          <input
            id="qrInput"
            className={qrStyles.input}
            placeholder={seqQr}
            minLength="1"
            min={1}
            maxLength="3"
            max={999}
            inputMode="tel"
            type="number"
            ref={seqQrRef}
          />
          <button
            className={qrStyles.generateButton}
            type="submit"
            onClick={generateSeqQrs}
          >
            Generate Sequential QRs
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
              placeholder="101, 102, ..."
              ref={customQrRef}
            />
            <button
              className={qrStyles.iconButton}
              type="button"
              onClick={addCustomNumber}
            >
              <FontAwesomeIcon icon={faPlusSquare} size="3x" color="#169188" />
            </button>
          </section>
          <p style={{ margin: "5px 20px", textAlign: "center" }}>
            {customQr && customQr + " "}
          </p>
          <p
            ref={customQrNotice}
            style={{ fontSize: "0.8em", color: "crimson" }}
          ></p>
        </section>
        <section>
          <button
            className={qrStyles.generateButton}
            type="button"
            onClick={generateCustomQrs}
          >
            Generate Custom QRs *
          </button>
        </section>

        <p className={qrStyles.infoText}>
          * - You can generate QRs with custom identity numbers.
          <br />
          Eg. Table/Room Numbers [101, 102, 103, 201, 202, 203 ...] and so on
        </p>
      </section>

      {viewQr && (
        <ViewQr
          seqQr={seqQr}
          customQr={customQr}
          alterViewQr={() => setViewQr(!viewQr)}
        />
      )}
    </Layout>
  )
}

export default QrCodes

export const updateSubscriber = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      id
    }
  }
`

export const getSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      seqQr
      customQr
    }
  }
`
