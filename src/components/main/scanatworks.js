import React from "react"
import scanatWorkStyles from "./scanatworks.module.css"
import hswImage1 from "../../images/hsw1.png"
import hswImage2 from "../../images/hsw2.png"
import hswImage3 from "../../images/hsw3.png"

const ScanatWorks = () => {
  return (
    <section className={scanatWorkStyles.container}>
      <h3>How Scan At Works</h3>
      <p>Ordering online has never been this easy</p>

      <section className={scanatWorkStyles.stepsContainer}>
        <section className={scanatWorkStyles.stepsHolder}>
          <section className={scanatWorkStyles.stepImage}>
            <img
              className={scanatWorkStyles.hswImages}
              src={hswImage1}
              alt="Explore Scan At Services"
            />
          </section>
          <p className={scanatWorkStyles.stepsContent}>
            Download the application and <b>Explore our services</b>
          </p>
        </section>

        <section className={scanatWorkStyles.stepsHolder}>
          <section className={scanatWorkStyles.stepImage}>
            <img
              className={scanatWorkStyles.hswImages}
              src={hswImage2}
              alt="Explore Scan At Services"
            />
          </section>
          <p className={scanatWorkStyles.stepsContent}>
            Browse through <b>Lists of services</b>
          </p>
        </section>

        <section className={scanatWorkStyles.stepsHolder}>
          <section className={scanatWorkStyles.stepImage}>
            <img
              className={scanatWorkStyles.hswImages}
              src={hswImage3}
              alt="Explore Scan At Services"
            />
          </section>
          <p className={scanatWorkStyles.stepsContent}>
            Get updated at at all times, <b>At Real time</b>
          </p>
        </section>
      </section>
    </section>
  )
}

export default ScanatWorks
