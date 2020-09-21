import React, { useEffect } from 'react'
import loaderStyles from './loader.module.css'
import LoadingImage from '../images/loading.png'
import Anime from 'animejs'

const Loader = () => {

    useEffect(() => {
        Anime({
            targets: document.getElementById('spinnerId'),
            loop: true,
            autoplay: true,
            rotate: [0, 360],
            easing: 'linear',
            duration: 800
        })
    }, [])

    return(
        <section className={loaderStyles.container}>
            <h1 className={loaderStyles.topic}>SCAN AT</h1>
            <img id="spinnerId" src={LoadingImage} alt="Scan At Loading Image" />
        </section>
    )
}

export default Loader