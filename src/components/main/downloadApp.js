import React from 'react'
import downloadAppStyles from './downloadApp.module.css'

const DownloadApp = () => {
    return(
        <section className={downloadAppStyles.container}>
            <secton className={downloadAppStyles.content}>
                <p className={downloadAppStyles.topic}>Download the Scan At App!</p>
                <p className={downloadAppStyles.desc}>We Support the initiative Local for Vocal</p>
            </secton>
        </section>
    )
}

export default DownloadApp