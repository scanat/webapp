import React from 'react'
import footerStyles from './footer.module.css'
import logo from '../images/scan_at_logo_textless.png'
import { Link } from 'gatsby'

const Footer = () => {
    return(
        <section className={footerStyles.container}>
            <section className={footerStyles.footer1}>
                <img className={footerStyles.logo} src={logo} alt="Scan At Logo" />
            </section>
            <hr />
            <section className={footerStyles.footer2}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/">About Scan At</Link></li>
                    <li><a href="https://www.scanat.in/">For Users</a></li>
                    <li><a href="https://subscriber.scanat.in/">For Partners</a></li>
                </ul>
            </section>
        </section>
    )
}

export default Footer