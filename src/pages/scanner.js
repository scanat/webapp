import React, { useEffect } from "react"
import scannerStyles from "./scanner.module.css"
import Layout from "../components/layout"

const Scanner = () => {
  const handleError = err => {
    console.log(err)
  }

  const handleResult = data => {
    alert(data)
  }

  const captureQr = () => {
      
  }

  return (
    <Layout>
      <section className={scannerStyles.qrReaderContainer}>
          <input type="file" accept="image/*" capture onChange={captureQr} ></input>
      </section>
    </Layout>
  )
}

export default Scanner
