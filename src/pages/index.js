import React from "react"
import { Link, navigate, graphql } from "gatsby"

import SEO from "../components/seo"
import Logo from "../components/logo"
import Swiper from "swiper"
import Img from "gatsby-image"
import {
  LeftOutlined,
  RightOutlined,
  MailOutlined,
  DownOutlined,
} from "@ant-design/icons"
import * as basicScroll from "basicscroll"
import classNames from "classnames"
import getItemById from "../utils/getItemById"
import getMonth from "../utils/getMonth"
import DepthImage from "../components/depthImage"
import VisibilitySensor from "react-visibility-sensor"
import stripHtml from "../utils/stripHtml"

class IndexPage extends React.Component {
  constructor(props) {
    super(props)

    this.articleSwiper = null
    this.swiperContainer = React.createRef()
    this.basicScrolls = []
    this.headerIsSticky = false
    this.page = React.createRef()
    this.buffer = 0
    this.timeout = null

    this.state = {
      mapKey: Math.random().toString(),
    }

    this.windowWidth = null
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      this.windowWidth = window.innerWidth
    }
    this.articleSwiper = new Swiper(this.swiperContainer.current, {
      direction: "horizontal",
      spaceBetween: 20,
      slidesPerView: "auto",
      touche: true,
      preloadImages: false,
      lazy: true,
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
      breakpoints: {
        420: {
          spaceBetween: 80,
        },
      },
    })

    document.querySelector("header").classList.add("home")

    // STICKY HEADER
    this.basicScrolls.push(
      basicScroll.create({
        elem: document.querySelector("header"),
        from: 0,
        to: window.innerHeight - 70,
        inside: () => {
          if (this.headerIsSticky) {
            document.querySelector("header").classList.add("home")
            this.headerIsSticky = false
          }
        },
        outside: () => {
          if (!this.headerIsSticky) {
            document.querySelector("header").classList.remove("home")
            this.headerIsSticky = true
          }
        },
      })
    )

    for (let i = 0; i < this.basicScrolls.length; i++) {
      this.basicScrolls[i].start()
    }

    window.onresize = this.resizeWindow
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

  resizeWindow = () => {
    if (this.windowWidth !== window.innerWidth) {
      this.windowWidth = window.innerWidth
      for (let i = 0; i < this.basicScrolls.length; i++) {
        this.basicScrolls[i].destroy()
        if (document.querySelector(".page-home")) {
          this.basicScrolls[i] = basicScroll.create({
            elem: document.querySelector("header"),
            from: 0,
            to: window.innerHeight - 70,
            inside: () => {
              if (this.headerIsSticky) {
                document.querySelector("header").classList.add("home")
                this.headerIsSticky = false
              }
            },
            outside: () => {
              if (!this.headerIsSticky) {
                document.querySelector("header").classList.remove("home")
                this.headerIsSticky = true
              }
            },
          })
          this.basicScrolls[i].start()
        }
      }
      this.articleSwiper.update()

      if (this.buffer === 0) {
        if (document.querySelector(".page-home")) {
          this.setState({ mapKey: Math.random().toString() })
        }
        this.buffer = 1
        this.timeout = setTimeout(() => {
          this.buffer = 0
        }, 1000)
      }
    }
  }

  getContinents = () => {
    return this.props.data.allWordpressCategory.edges.filter((c, i) => {
      return (
        c.node.acf &&
        c.node.acf.type === "geographique" &&
        c.node.wordpress_parent === 0
      )
    })
  }

  getCategories = () => {
    return this.props.data.allWordpressCategory.edges.filter((c, i) => {
      return (
        c.node.acf &&
        c.node.acf.type === "informatif" &&
        c.node.wordpress_parent === 0
      )
    })
  }

  componentWillUnmount() {
    for (let i = 0; i < this.basicScrolls.length; i++) {
      this.basicScrolls[i].destroy()
    }

    this.articleSwiper.destroy()
    clearTimeout(this.timeout)
    window.onresize = null
  }

  render() {
    const { data, location } = this.props

    const articles = data.allWordpressPost.edges
    const email = data.wordpressAcfOptions.options.email
    let counter = 0

    return (
      <div className="page page-home" ref={this.page}>
        <SEO
          title="Adrenatrip - Accueil"
          location={location}
          description={stripHtml(
            data.wordpressPage.content.substring(0, 130) + "..."
          )}
        />

        <section className="splash-screen">
          <DepthImage
            image={data.file2}
            depthmap={data.file}
            key={this.state.mapKey}
            resize={this.resizeWindow}
            toggleAdvancedBackground={this.toggleAdvancedBackground}
          ></DepthImage>

          <div className={`depth-image-image`} style={{ backgroundImage: "" }}>
            <div
              className="gatsby-image-wrapper"
              style={{
                minWidth: "100vw",
                maxHeight: "140vh",
                backgroundImage: `url('${data.file2.childImageSharp.base64.base64}')`,
              }}
            ></div>
            {/*<Img
              key={this.state.mapKey}
              fluid={data.file2.childImageSharp.fluid}
            /> */}
          </div>

          <div className="content">
            <div
              className={"home-logo fade-in"}
              style={{ "--anim-order": "1" }}
              key="0"
            >
              <Logo />
            </div>
            <div
              className={"headline fade-in"}
              style={{ "--anim-order": "2" }}
              key="1"
              dangerouslySetInnerHTML={{
                __html: data.wordpressAcfOptions.options.heading_text,
              }}
            ></div>
            <div
              className={"cta fade-in"}
              style={{ "--anim-order": "3" }}
              key="2"
            >
              <Link to={`/articles/${articles[0].node.slug}`}>
                Lire l'article le plus récent
              </Link>
            </div>
            <div className={" fade-in"} key="3">
              <div className="go-down">
                <DownOutlined />
              </div>
            </div>
          </div>
        </section>

        <section className="slider articles-slider">
          <VisibilitySensor>
            {({ isVisible }) => {
              const classes = classNames("fader", {
                isVisible: isVisible || counter > 0,
              })
              if (isVisible && counter < 1) {
                counter = 1
              }
              return (
                <h2
                  className={classes}
                  onClick={() => {
                    navigate("/articles")
                  }}
                >
                  Articles
                </h2>
              )
            }}
          </VisibilitySensor>
          <div className="swiper-container" ref={this.swiperContainer}>
            <div className="swiper-wrapper">
              {articles.map((a, i) => {
                a = a.node
                const date = a.date.split("/")

                return (
                  <article
                    className="swiper-slide"
                    key={`articles-slide-${i}`}
                    style={{ "--anim-order": i }}
                  >
                    <Link to={`/articles/${a.slug}`}>
                      <div className="thumbnail">
                        <Img
                          fluid={
                            a.acf.featured_image.localFile.childImageSharp.fluid
                          }
                          className="swiper-lazy"
                        />
                        <div className="swiper-lazy-preloader"></div>
                      </div>
                      <div className="content">
                        <h4
                          title={a.title}
                          dangerouslySetInnerHTML={{
                            __html: `${a.title.substring(0, 35)}${
                              a.title.length > 35 ? "..." : ""
                            }`,
                          }}
                        ></h4>
                        <p>{`${date[0]} ${getMonth(date[1])} ${date[2]}`}</p>
                      </div>
                    </Link>
                    <div className="tags">
                      {a.categories.map((c, j) => {
                        const cat = getItemById(
                          c.id,
                          data.allWordpressCategory.edges
                        )
                        if (cat.wordpress_parent !== 0) return null
                        if (cat.acf === null) return null
                        const catClasses = classNames("tag", cat.acf.type)
                        return (
                          <div
                            href={`#${cat.slug}|${
                              cat.acf.type === "informatif" ? "i" : "g"
                            }`}
                            className={catClasses}
                            key={`articles-slide-${i}-cat-${j}`}
                            onClick={this.handleCategoryClick}
                          >
                            {cat.name}
                          </div>
                        )
                      })}
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="swiper-button-prev">
              <LeftOutlined />
            </div>
            <div className="swiper-button-next active">
              <RightOutlined />
            </div>
          </div>
        </section>
        <VisibilitySensor partialVisibility>
          {({ isVisible }) => {
            const classes = classNames("about fader", {
              isVisible: isVisible || counter > 1,
            })

            if (isVisible && counter < 2) {
              counter = 2
            }
            return (
              <section className={classes}>
                <div className="content">
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: data.wordpressPage.title,
                    }}
                  ></h2>
                  <span
                    className="text"
                    dangerouslySetInnerHTML={{
                      __html: data.wordpressPage.content,
                    }}
                  ></span>
                  <div className="cta">
                    <a href={`mailto:${email}`}>
                      Contacter Mélanie <MailOutlined />
                    </a>
                  </div>
                </div>
                <div className="picture">
                  <Img
                    fluid={
                      data.wordpressPage.acf.picture.localFile.childImageSharp
                        .fluid
                    }
                  />
                </div>
              </section>
            )
          }}
        </VisibilitySensor>

        <section className="section-categories">
          <VisibilitySensor partialVisibility="bottom">
            {({ isVisible }) => {
              const classes = classNames("fader", {
                isVisible: isVisible || counter > 2,
              })

              if (isVisible && counter < 3) {
                counter = 3
              }
              return <h3 className={classes}>Continents</h3>
            }}
          </VisibilitySensor>
          <div className="continents">
            {this.getContinents().map((c, i) => {
              if (!c.node.acf) return null
              return (
                <a
                  className="continent"
                  key={`categories-continent-${i}`}
                  style={{ "--anim-order": i }}
                  onClick={this.handleCategoryClick}
                  href={`#${c.node.slug}|${
                    c.node.acf.type === "informatif" ? "i" : "g"
                  }`}
                >
                  <div className="overlay"></div>
                  <div className="thumbnail">
                    <Img
                      fluid={
                        c.node.acf.thumbnail.localFile.childImageSharp.fluid
                      }
                    />
                  </div>
                  <span>
                    <h5>{c.node.name}</h5>
                  </span>
                </a>
              )
            })}
          </div>
          <VisibilitySensor>
            {({ isVisible }) => {
              const classes = classNames("text-center cat fader", {
                isVisible: isVisible || counter > 3,
              })

              if (isVisible && counter < 4) {
                counter = 4
              }
              return <h3 className={classes}>Categories</h3>
            }}
          </VisibilitySensor>
          <div className="categories">
            {this.getCategories().map((c, i) => {
              if (!c.node.acf || !c.node.acf.thumbnail) return null

              return (
                <a
                  className="categorie"
                  key={`categories-categ-${i}`}
                  style={{ "--anim-order": i }}
                  onClick={this.handleCategoryClick}
                  href={`#${c.node.slug}|${
                    c.node.acf.type === "informatif" ? "i" : "g"
                  }`}
                >
                  <div className="thumbnail">
                    <Img
                      fluid={
                        c.node.acf.thumbnail.localFile.childImageSharp.fluid
                      }
                    />
                  </div>
                  <h5>{c.node.name}</h5>
                </a>
              )
            })}
          </div>
        </section>
      </div>
    )
  }
}

export default IndexPage

export const HomeQuery = graphql`
  query home {
    allWordpressPost(sort: { order: DESC, fields: date }) {
      edges {
        node {
          id
          author
          content
          slug
          date(formatString: "D/MM/YYYY")
          title
          categories {
            id
          }
          acf {
            featured_image {
              localFile {
                name
                childImageSharp {
                  fluid(maxWidth: 450, maxHeight: 344, fit: COVER) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
            }
          }
        }
      }
    }
    allWordpressCategory {
      edges {
        node {
          name
          acf {
            type
            thumbnail {
              localFile {
                name
                childImageSharp {
                  fluid(maxWidth: 350) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
            }
          }
          id
          wordpress_parent
          slug
        }
      }
    }
    wordpressPage(slug: { eq: "index" }) {
      content
      title
      acf {
        picture {
          localFile {
            name
            childImageSharp {
              fluid(maxWidth: 640) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
    wordpressAcfOptions {
      options {
        email
        heading_text
      }
    }

    file(name: { eq: "depthmap6" }) {
      name
      absolutePath
      childImageSharp {
        fluid(quality: 50) {
          originalImg
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    file2: file(name: { eq: "home-bg" }) {
      name
      absolutePath
      childImageSharp {
        fluid(quality: 100) {
          ...GatsbyImageSharpFluid_withWebp
          originalImg
        }
        base64: sizes(base64Width: 1920, maxHeight: 1280, quality: 100) {
          base64
        }
      }
    }
  }
`
