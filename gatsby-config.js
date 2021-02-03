require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
module.exports = {
  siteMetadata: {
    title: `Scan At`,
    description: `A dynamic contactless automation system for food serving organizations or businesses.`,
    author: `omkarDeshmukh@scanat`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
      options: {
        name: `backgrounds`,
        path: `${__dirname}/src/images/backgrounds`,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-sharp`,
      options: {
        checkSupportedExtensions: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Scanat`,
        short_name: `Scanat`,
        start_url: `/`,
        background_color: `white`,
        theme_color: `#169188`,
        display: `minimal-ui`,
        icon: `src/images/scan_at_logo_textless.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Roboto"],
        },
      },
    },
    `gatsby-plugin-offline`,
  ]
}
