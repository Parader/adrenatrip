import React from "react"
import { Link, graphql } from "gatsby"
import ReactDOM from "react-dom"
import Img from "gatsby-image"
import SEO from "../components/seo"
import stripHtml from "../utils/stripHtml"

import { Layout } from "antd"

const { Content } = Layout

const times = x => f => {
  if (x > 0) {
    f()
    times(x - 1)(f)
  }
}

class PageTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.content = React.createRef()
  }

  componentDidMount() {
    if (typeof window !== `undefined`) {
      this.replaceLinks()
      this.replaceImages()
    }
  }

  replaceLinks() {
    const links = this.content.current.getElementsByTagName("a")
    if (links.length > 0) {
      let elm, link, parent
      times(links.length)(() => {
        link = links[0]
        parent = link.parentElement
        elm = document.createElement("span")
        link.parentElement.insertBefore(elm, link)
        if (!link.attributes.target) {
          parent.removeChild(link)
          this.renderLink(elm, link.attributes.href.value, link.text)
        }
      })
    }
  }

  replaceImages() {
    const { images } = this.props.data.wordpressPage.acf
    const imgs = this.content.current.getElementsByTagName("figure")
    if (imgs.length > 0) {
      times(imgs.length)(() => {
        const img = imgs[0]
        let alt = ""
        if (img.attributes["data-alt"]) {
          alt = img.attributes["data-alt"].nodeValue
        } else {
          alt = img.firstChild
            ? img.firstChild.nextSibling.attributes[1].value
            : ""
        }

        const imgUrl = img.attributes[0].value
        const imgName = imgUrl.substring(
          imgUrl.lastIndexOf("/") + 1,
          imgUrl.lastIndexOf(".")
        )

        const file = images.filter(i => i.localFile.name === imgName)[0]
        const fluidImage = file.localFile.childImageSharp.fluid

        const elm = document.createElement("span")
        const isZoomable = !img.classList.contains("full-screen-image")

        img.parentElement.insertBefore(elm, img)
        img.remove()
        this.renderImage(elm, fluidImage, alt, isZoomable)
      })
    }
  }

  renderLink(elm, href, text) {
    ReactDOM.render(<Link to={href}>{text}</Link>, elm)
  }

  renderImage(elm, image, alt, isZoomable) {
    ReactDOM.render(
      <>
        <Img fluid={image} alt={alt} isZoomable={isZoomable} />
        <p className="alt">{alt}</p>
      </>,
      elm
    )
  }

  swapFigures() {
    const currentPage = this.props.data.wordpressPage
    const regex = /<figure[^>]*><img[^>]*src="([^"]*)".*?alt="([^"]*)".*?<\/figure>/g
    const figures = currentPage.content.replace(
      regex,
      '<figure data-src="$1" data-alt="$2" ></figure>'
    )

    return figures
  }

  render() {
    const { location } = this.props
    const currentPage = this.props.data.wordpressPage

    const content = this.swapFigures()

    return (
      <div className={`page ${currentPage.slug}`}>
        <SEO
          title={currentPage.title}
          location={location}
          description={stripHtml(currentPage.content.substring(0, 150) + "...")}
        />
        <Content className="content-wrapper">
          <div className="page-content">
            <h1
              className="fade-in"
              dangerouslySetInnerHTML={{ __html: currentPage.title }}
            />
            <div
              className="fade-in"
              ref={this.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </Content>
      </div>
    )
  }
}

export default PageTemplate

export const pageQuery = graphql`
  query($id: String!) {
    wordpressPage(id: { eq: $id }) {
      title
      content
      date(formatString: "MMMM DD, YYYY")
      slug
      acf {
        images {
          localFile {
            name
            childImageSharp {
              fluid(maxWidth: 1920) {
                ...GatsbyImageSharpFluid
                presentationWidth
              }
            }
          }
        }
      }
    }
    site {
      id
      siteMetadata {
        title
      }
    }
  }
`
