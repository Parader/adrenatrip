import React from "react"
import { Link, graphql } from "gatsby"
import ReactDOM from "react-dom"
import Img from "../components/image"
import getItemById from "../utils/getItemById"
import classNames from "classnames"
import Zoom from "react-medium-image-zoom"
import { Layout, Breadcrumb } from "antd"
import InstagramModule from "../components/instagramModule"
import PostFooter from "../components/postFooter"
import { DiscussionEmbed } from "disqus-react"

const { Content } = Layout

const disqusConfig = {
  shortname: process.env.GATSBY_DISQUS_NAME,
  config: { identifier: "", title: "" },
}

const times = x => f => {
  if (x > 0) {
    f()
    times(x - 1)(f)
  }
}

class PostTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.content = React.createRef()
  }

  componentDidMount() {
    this.replaceLinks()
    this.replaceImages()
  }

  handleCategoryClick = () => {}

  replaceLinks() {
    const links = this.content.current.getElementsByTagName("a")
    if (links.length > 0) {
      let elm, link, parent
      times(links.length)(() => {
        link = links[0]
        parent = link.parentElement
        elm = document.createElement("span")
        link.parentElement.insertBefore(elm, link)
        parent.removeChild(link)
        if (!link.attributes.target) {
          this.renderLink(elm, link.attributes.href.value, link.text)
        }
      })
    }
  }

  replaceImages() {
    const { images } = this.props.data.wordpressPost.acf
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
    const currentPost = this.props.data.wordpressPost
    const regex = /<figure[^>]*><img[^>]*src="([^"]*)".*?alt="([^"]*)".*?<\/figure>/g
    const figures = currentPost.content.replace(
      regex,
      '<figure data-src="$1" data-alt="$2" ></figure>'
    )

    return figures
  }

  render() {
    const { data, pageContext, location } = this.props
    const siteMetadata = data.site.siteMetadata
    const currentPost = data.wordpressPost
    const allWordpressAcfOptions = data.allWordpressAcfOptions

    const hasCover = data.wordpressPost.acf.featured_image
    const content = this.swapFigures()
    const categories = currentPost.categories.reduce((sum, e, i) => {
      const c = getItemById(e.id, data.allWordpressCategory.edges)
      return [c, ...sum]
    }, [])

    return (
      <div className={`post ${currentPost.slug}`}>
        <Content className="content-wrapper">
          {hasCover && (
            <div className="post-cover">
              <Img
                fluid={
                  data.wordpressPost.acf.featured_image.localFile
                    .childImageSharp.fluid
                }
                alt={data.wordpressPost.acf.featured_image.alt_text}
              />
            </div>
          )}

          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item>Articles</Breadcrumb.Item>
            <Breadcrumb.Item>{currentPost.title}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="post-content">
            <h1 dangerouslySetInnerHTML={{ __html: currentPost.title }} />
            <div className="categories">
              {categories.map((c, i) => {
                if (c.wordpress_parent !== 0) return
                if (c.acf === null) return
                const catClasses = classNames("category", c.acf.type)
                return (
                  <Link
                    to={`/articles?${
                      c.acf.type === "geographique" ? "c" : "cat"
                    }=${c.slug}`}
                    className={catClasses}
                    key={`article-categ-${i}`}
                    onClick={this.handleCategoryClick}
                  >
                    {c.name}
                  </Link>
                )
              })}
            </div>
            <div
              ref={this.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <PostFooter
              currentPost={{ url: location.href, categories }}
              nextPost={
                data.nextPost && {
                  url: `/articles/${pageContext.next.slug}`,
                  thumbnail: data.nextPost.acf.featured_image,
                }
              }
            />
            <DiscussionEmbed
              shortname={"adrenatrip"}
              config={{
                identifier: currentPost.slug,
                title: currentPost.title,
              }}
              className="comments"
            />
            <InstagramModule
              options={allWordpressAcfOptions.edges[0].node.options}
            />
          </div>
        </Content>
      </div>
    )
  }
}

export default PostTemplate

export const postQuery = graphql`
  query($id: String!, $nextId: String) {
    allWordpressCategory {
      edges {
        node {
          name
          acf {
            type
          }
          id
          wordpress_parent
          slug
        }
      }
    }
    wordpressPost(id: { eq: $id }) {
      title
      content
      date(formatString: "MMMM DD, YYYY")
      slug
      categories {
        id
      }
      acf {
        featured_image {
          alt_text
          localFile {
            name
            childImageSharp {
              fluid(maxWidth: 680, maxHeight: 520, fit: COVER) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
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
    allWordpressAcfOptions {
      edges {
        node {
          options {
            news_band_text
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
    nextPost: wordpressPost(id: { eq: $nextId }) {
      acf {
        featured_image {
          localFile {
            childImageSharp {
              fixed(width: 680) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`
