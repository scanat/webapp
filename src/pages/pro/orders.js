import React, { useState, useEffect } from "react"
import Layout from "../../components/layout"
import { getCurrentUser } from "../../utils/auth"
import orderStyles from "./orders.module.css"
import config from "../../config.json"
import axios from "axios"
import SnackBar from "../../components/snackBar"

const Orders = () => {
  const [noQrs, setNoQrs] = useState(null)
  const [snackContent, setSnackContent] = useState()
  const [snackError, setSnackError] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setSnackContent()
    }, 5000)
  }, [snackContent, snackError])

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

  const switchContent = (content, err) => {
    setSnackContent(content)
    setSnackError(err)
  }

  return (
    <Layout>
      <h1 className={orderStyles.topic}>Live Orders</h1>
      <section className={orderStyles.gridContainer}>
        {[...Array(noQrs)].map((item, id) => (
          <section className={orderStyles.orderGrid}>
            <h1>{id+1}</h1>
          </section>
        ))}
      </section>

      {snackContent && <SnackBar message={snackContent} err={snackError} />}
    </Layout>
  )
}

export default Orders
