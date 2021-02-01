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
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
    // {
    //   resolve: "gatsby-source-graphql",
    //   options: {
    //     typeName: "Subscriber",
    //     fieldName: "subscriber",
    //     url: "https://hyfppjcmhnekdbhugty7cdcsjm.appsync-api.ap-south-1.amazonaws.com/graphql",
    //     headers: {
    //       "x-api-key": "da2-ikygy37qvjhhphetapy6jfsrr4"
    //     }
    //   }
    // },
    `gatsby-plugin-offline`,
  ],
}
