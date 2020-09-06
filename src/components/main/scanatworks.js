import React from 'react'
import scanatWorkStyles from './scanatworks.module.css'

const ScanatWorks = () => {
    return(
        <section className={scanatWorkStyles.container}>
            <h3>How Scan At Works</h3>
            <p>Ordering online has never been this easy</p>

            <section className={scanatWorkStyles.stepsContainer}>
                <section className={scanatWorkStyles.stepsHolder}>
                    <section className={scanatWorkStyles.stepImage}></section>
                    <p style={{maxWidth: 200, textAlign: "center", margin: '10px auto'}}>Download the application and <b>Explore our services</b></p>
                </section>

                <section className={scanatWorkStyles.stepsHolder}>
                    <section className={scanatWorkStyles.stepImage}></section>
                    <p style={{maxWidth: 200, textAlign: "center", margin: '10px auto'}}>Browse through <b>Lists of services</b></p>
                </section>

                <section className={scanatWorkStyles.stepsHolder}>
                    <section className={scanatWorkStyles.stepImage}></section>
                    <p style={{maxWidth: 200, textAlign: "center", margin: '10px auto'}}>Get updated at at all times, <b>At Real time</b></p>
                </section>
            </section>
        </section>
    )
}

export default ScanatWorks