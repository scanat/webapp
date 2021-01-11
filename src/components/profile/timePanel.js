import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import timePanelStyles from "./timePanel.module.css"

const TimePanel = props => {
  const [time, setTime] = useState({
    day1: "Mon",
    day2: "Sat",
    time1: "10:00",
    time2: "22:00",
  })

  useEffect(() => {
    props.submit && props.setTiming(time)
  }, [props.submit])


  return (
    <section className={timePanelStyles.container}>
      
    </section>
  )
}

export default TimePanel
