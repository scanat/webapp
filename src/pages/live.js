import DefaultLayout from "../components/menuLayouts/default"
import Layout from "../components/layout"
import liveStyles from "./live.module.css"
import React from "react"

const Live = ({ location }) => {
  return (
    <Layout>
      <DefaultLayout location={location} />
    </Layout>
  )
}

export default Live
