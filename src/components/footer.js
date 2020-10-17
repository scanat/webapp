import React from 'react'
import footerStyles from './footer.module.css'
import { Link } from 'gatsby'

const Footer = () => {
    return(
        <section className={footerStyles.container}>
            <section className={footerStyles.footer2}>
                <ul>
                    <li><Link to="/">Explore</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><a href="https://www.scanat.in/">Users</a></li>
                    <li><a href="https://subscriber.scanat.in/">Partners</a></li>
                </ul>
            </section>
            <hr />
            <section className={footerStyles.footerCopyRights}>
                <label>© All rights reserved for Scan At. 2020.</label>
            </section>
        </section>
    )
}

export default Footer