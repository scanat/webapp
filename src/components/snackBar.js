import React from "react"
import snackBarStyles from "./snackBar.module.css"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SnackBar = props => {
  return (
    <section className={snackBarStyles.container}>
      <p style={{ margin: "0 5px", color: "red" }}>
        The credentials must be correct
      </p>
      <FontAwesomeIcon
        icon={faTimes}
        type='button'
        style={{ margin: "0 5px" }}
        onClick={() => props.onCloseSnack()}
      />
    </section>
  )
}

export default SnackBar
