import React, { useEffect } from "react"
import loaderStyles from "./loader.module.css"

const Loader = props => {

  return (
    <section
      className={loaderStyles.container}
      style={{ display: props.loading ? "flex" : "none" }}
    >
      <div className={loaderStyles.snippet}>
        <div className={loaderStyles.dotovertaking}></div>
      </div>
    </section>
  )
}

export default Loader
