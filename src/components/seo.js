/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({
  description,
  lang,
  meta,
  title,
  type = "blog",
  location,
  image,
}) {
  const { site, metaImage } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        metaImage: file(name: { eq: "meta_image" }) {
          name
          childImageSharp {
            fluid(quality: 100) {
              originalImg
            }
          }
        }
      }
    `
  )

  const metaDescription = description
  if (location.href && location.href.includes("/articles/")) {
    type = "article"
  }
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: type,
        },
        {
          property: `og:url`,
          content: location.href,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: `${location.origin}${
            image ? image : metaImage.childImageSharp.fluid.originalImg
          }`,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:url`,
          content: location.href,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: `${location.origin}${
            image ? image : metaImage.childImageSharp.fluid.originalImg
          }`,
        },
      ].concat(meta)}
    >
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self'; img-src https://*; child-src 'none';"
      />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
