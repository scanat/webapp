import React from "react"
import snackBarStyles from "./snackBar.module.css"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SnackBar = props => {

  const closeSnackBar = () => {
    document.getElementById('snackBarContainer').style.display = 'none'
  }
  return (
    <section id='snackBarContainer' className={snackBarStyles.container}>
      <p style={{ margin: "0 5px", color: props.err ? 'green' : "red" }}>
        {props.message}
      </p>
      <FontAwesomeIcon
        icon={faTimes}
        type='button'
        style={{ margin: "0 5px" }}
        onClick={closeSnackBar}
      />
    </section>
  )
}

export default SnackBar
