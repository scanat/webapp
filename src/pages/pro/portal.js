import React from "react"
import portalStyles from "./portal.module.css"
import UserDetails from "../../components/profile/userDetails"
import Modules from "../../components/profile/modules"
import Portfolio from "../../components/profile/portfolio"
import EmployeeManagement from "../../components/profile/employeeManagement"
import QrCodes from "../../components/profile/qrCodes"
import Orders from "../../components/profile/orders"
import IndexPage from ".."
import CategoryBasic from "../../components/profile/category-basic"

const Portal = ({ location }) => {

  switch (new URLSearchParams(location.search).get("id")) {
    case "businessdetails":
      return <UserDetails />

    case "modules":
      return <Modules />

    case "portfolio":
      return <Portfolio />

    case "products":
      return <CategoryBasic />

    case "liveorders":
      return <Orders />

    case "qrcodes":
      return <QrCodes />

    case "employeemanagement":
      return <EmployeeManagement />

    default:
      return <IndexPage />
  }
}

export default Portal
