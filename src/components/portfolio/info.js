import {
  faCheckCircle,
  faCopy,
  faMapMarkedAlt,
  faPhoneSquareAlt,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef } from "react"
import infoStyles from "./info.module.css"
import CopyToClipboard from "react-copy-to-clipboard"
import Anime from 'animejs'

const Info = props => {
  const containerRef = useRef(null)

  useEffect(() => {
    props.show
      ? Anime({
          targets: containerRef.current,
          bottom: ["-350px", 0],
          easing: "linear",
          duration: 200,
        }).play()
      : Anime({
          targets: containerRef.current,
          bottom: [0, "-350px"],
          easing: "linear",
          duration: 200,
        }).play()
  }, [props.show])
  return (
    <section ref={containerRef} className={infoStyles.container}>
      <h4>Basic Information</h4>
      <p>
        {props.address.address1 +
          " " +
          props.address.address2 +
          " " +
          props.address.city +
          " " +
          props.address.state +
          " " +
          props.address.postalCode}
      </p>

      <ul className={infoStyles.infoDetails}>
        <li>
          <FontAwesomeIcon icon={faMapMarkedAlt} size="lg" />
        </li>
        <li>
          <CopyToClipboard
            text={`${props.address.address1} ${props.address.address2} ${props.address.city} ${props.address.state} ${props.address.postalCode}`}
          >
            <FontAwesomeIcon icon={faCopy} size="lg" />
          </CopyToClipboard>
        </li>
        <li>
          <a href={`tel:${props.phoneNumber}`}>
            <FontAwesomeIcon icon={faPhoneSquareAlt} size="lg" color="green" />
          </a>
        </li>
      </ul>
      <br />
      <br />
      <hr />
      <br />
      <h4>About Us</h4>
      <p>{props.about}</p>
      <br />
      <h4>Additional Details</h4>
      <ul className={infoStyles.additionalDetailsContainer}>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Wifi
        </li>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Indoor Seating
        </li>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Card Accepted
        </li>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Car Parking
        </li>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Non Veg
        </li>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Home Delivery
        </li>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Smoking Area
        </li>
        <li>
          <FontAwesomeIcon icon={faCheckCircle} color="green" /> Bar
        </li>
      </ul>
    </section>
  )
}

export default Info
