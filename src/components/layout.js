/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Footer from "./footer"
import "antd/dist/antd.less"
import "swiper/swiper.scss"
import "../styles/styles.scss"
import "react-medium-image-zoom/dist/styles.css"

const Layout = ({ children, location, ...props }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header location={location} siteTitle={data.site.siteMetadata.title} />
      <div>
        <main>{children}</main>
      </div>
      <Footer location={location} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
