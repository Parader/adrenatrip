import React from "react"
import { Link, graphql, navigate } from "gatsby"
import ReactDOM from "react-dom"
import Img from "../components/image"
import getItemById from "../utils/getItemById"
import classNames from "classnames"
import { Layout, Breadcrumb } from "antd"
import InstagramModule from "../components/instagramModule"
import PostFooter from "../components/postFooter"
import { DiscussionEmbed } from "disqus-react"
import getMonth from "../utils/getMonth"
import SEO from "../components/seo"
import stripHtml from "../utils/stripHtml"

const { Content } = Layout

class PostTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.content = React.createRef()
    this.state = {}
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
      for (let i = 0; i < links.length; i++) {
        link = links[0]
        parent = link.parentElement
        elm = document.createElement("span")
        link.parentElement.insertBefore(elm, link)
        parent.removeChild(link)
        if (!link.attributes.target) {
          this.renderLink(elm, link.attributes.href.value, link.text)
        }
      }
    }
  }

  replaceImages() {
    const { images } = this.props.data.wordpressPost.acf
    const imgs = this.content.current.querySelectorAll("figure")

    if (imgs.length > 0) {
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        if (
          !img.classList.value.includes("embed") &&
          !img.classList.value.includes("block-table")
        ) {
          let alt = ""
          if (img.attributes["data-alt"]) {
            alt = img.attributes["data-alt"].nodeValue
          } else {
            alt =
              img.firstChild &&
              img.firstChild.nextSibling &&
              img.firstChild.nextSibling.attributes[1]
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
          const isZoomable = !img.parentElement.classList.contains(
            "full-screen-image"
          )

          img.parentElement.insertBefore(elm, img)
          img.remove()
          this.renderImage(elm, fluidImage, alt, isZoomable)
        }
      }
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
    const regex = /<figure[^>]*(?!embed)[^>]*>[^>]*?<img[^>]*src="([^"]*)".*?alt="([^"]*)".*?<\/figure>/gms // /<figure[^>]*><img[^>]*src="([^"]*)".*?alt="([^"]*)".*?<\/figure>/gm
    const regexp = new RegExp(regex)

    const figures = currentPost.content.replace(
      regexp,
      '<figure data-src="$1" data-alt="$2" ></figure>'
    )

    return figures
  }

  handleCategoryClick = e => {
    e.stopPropagation()
    e.preventDefault()
    navigate(
      `/articles/${
        e.target.getAttribute("href") !== null
          ? e.target.getAttribute("href")
          : e.target.closest("a").getAttribute("href")
      }`
    )
  }

  render() {
    const { data, pageContext, location } = this.props
    const currentPost = data.wordpressPost
    const allWordpressAcfOptions = data.allWordpressAcfOptions

    const hasCover = data.wordpressPost.acf.featured_image
    const content = this.swapFigures()
    const categories = currentPost.categories.reduce((sum, e, i) => {
      const c = getItemById(e.id, data.allWordpressCategory.edges)
      return [c, ...sum]
    }, [])

    const fadeIn = {
      y: 0,
      opacity: 1,
      duration: 200,
      delay: 200,
    }
    const date = data.wordpressPost.date.split("/")

    return (
      <div className={`post ${currentPost.slug}`}>
        <SEO
          title={data.wordpressPost.title}
          location={location}
          description={stripHtml(
            data.wordpressPost.content.substring(0, 130) + "..."
          )}
          image={data.wordpressPost.acf.featured_image.localFile.url}
        />
        <Content className="content-wrapper">
          {hasCover && (
            <div className="post-cover fade-in" style={{ "--anim-order": "0" }}>
              <Img
                fluid={
                  data.wordpressPost.acf.featured_image.localFile
                    .childImageSharp.fluid
                }
                alt={data.wordpressPost.acf.featured_image.alt_text}
              />
            </div>
          )}
          <Breadcrumb
            className="breadcrumb fade-in"
            style={{ "--anim-order": "1" }}
          >
            <Breadcrumb.Item>
              <Link to="/articles"> Articles</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span
                dangerouslySetInnerHTML={{ __html: currentPost.title }}
              ></span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="post-content">
            <h1
              className="title fade-in"
              style={{ "--anim-order": "2" }}
              dangerouslySetInnerHTML={{ __html: currentPost.title }}
            />
            <p className="date fade-in" style={{ "--anim-order": "3" }}>
              {" "}
              {`${date[0]} ${getMonth(date[1])} ${date[2]}`}
            </p>
            <div className="categories fade-in" style={{ "--anim-order": "4" }}>
              {categories.map((c, i) => {
                if (c.wordpress_parent !== 0) return null
                if (c.acf === null) return null
                const catClasses = classNames("category", c.acf.type)
                return (
                  <a
                    href={`#${c.slug}|${
                      c.acf.type === "informatif" ? "i" : "g"
                    }`}
                    className={catClasses}
                    onClick={this.handleCategoryClick}
                    key={`article-categ-${i}`}
                  >
                    {c.name}
                  </a>
                )
              })}
            </div>{" "}
            <div
              ref={this.content}
              dangerouslySetInnerHTML={{ __html: content }}
              className="fade-in"
              style={{ "--anim-order": "5" }}
            />
            <PostFooter
              handleCategoryClick={this.handleCategoryClick}
              currentPost={{ url: location.href, categories }}
              nextPost={
                data.nextPost && {
                  url: `/articles/${pageContext.next.slug}`,
                  thumbnail: data.nextPost.acf.featured_image,
                }
              }
            />
            <DiscussionEmbed
              shortname={"adrenatrip-1"}
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
      date(formatString: "D/MM/YYYY")
      slug
      categories {
        id
      }
      acf {
        featured_image {
          alt_text
          localFile {
            name
            url
            childImageSharp {
              fluid(maxWidth: 680, maxHeight: 520, fit: COVER) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
        images {
          localFile {
            name
            childImageSharp {
              fluid(maxWidth: 1920) {
                ...GatsbyImageSharpFluid_withWebp
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
              fixed(width: 380) {
                ...GatsbyImageSharpFixed_withWebp
              }
            }
          }
        }
      }
    }
  }
`
