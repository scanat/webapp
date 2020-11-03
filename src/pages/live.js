import React from "react"
import liveStyles from "./live.module.css"
import DefaultLayout from "../components/menuLayouts/default"
import Layout from "../components/layout"

const Live = ({ location }) => {
  return (
    <Layout>
      <DefaultLayout location={location} />
    </Layout>
  )
}

export default Live
