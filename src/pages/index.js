import React from "react"
import { Link } from "gatsby"

import Image from "../components/image"
import SEO from "../components/seo"
import { Button } from "antd"
import Logo from "../components/logo"
import Swiper from "swiper"
import Img from "gatsby-image"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import * as basicScroll from "basicscroll"
import classNames from "classnames"
import getItemById from "../utils/getItemById"
import getMonth from "../utils/getMonth"

class IndexPage extends React.Component {
  constructor(props) {
    super(props)

    this.articleSwiper = null
    this.swiperContainer = React.createRef()
    this.basicScrolls = []
    this.headerIsSticky = false
  }

  componentDidMount() {
    this.articleSwiper = new Swiper(this.swiperContainer.current, {
      direction: "horizontal",
      spaceBetween: 80,
      slidesPerView: "auto",
      touche: true,
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
      },
    })

    // background opacity
    this.basicScrolls.push(
      basicScroll.create({
        elem: document.querySelector(".background"),
        from: window.innerHeight * 0.2,
        to: window.innerHeight * 0.6,
        props: {
          "--opacity": {
            from: 1,
            to: 0,
          },
        },
      })
    )

    // background-movement
    this.basicScrolls.push(
      basicScroll.create({
        elem: document.querySelector(".bg-3"),
        from: 0,
        to: "400px",
        props: {
          "--top": {
            from: 0,
            to: "-40px",
          },
        },
      })
    )

    // cloud movement
    this.basicScrolls.push(
      basicScroll.create({
        elem: document.querySelector(".bg-1"),
        from: 0,
        to: window.innerHeight * 0.8,
        props: {
          "--top2": {
            from: 0,
            to: `-${window.innerHeight / 4}px`,
          },
        },
      })
    )

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

    this.props.navigate(e.target.getAttribute("href"))
  }

  resizeWindow = () => {
    for (let i = 0; i < this.basicScrolls.length; i++) {
      this.basicScrolls[i].calculate()
      this.basicScrolls[i].update()
    }
    this.articleSwiper.update()
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
  }

  render() {
    const { data } = this.props

    const articles = data.allWordpressPost.edges

    return (
      <div className="page page-home">
        <SEO title="Home" />

        <section className="splash-screen">
          <div className="home-logo">
            <Logo />
          </div>

          <div className="background bg-1"></div>
          <div className="headline">
            <h1>Un blog de voyage pour raconter mes trips</h1>
            <p>moi c'est Mélanie</p>
          </div>
          <div className="cta">
            <Link to={`/articles/${articles[0].node.slug}`}>
              Lire l'article le plus récent
            </Link>
          </div>
          <div className="background bg-2"></div>
          <div className="background bg-3"></div>
        </section>

        <section className="slider articles-slider">
          <h2>Articles</h2>
          <div className="swiper-container" ref={this.swiperContainer}>
            <div className="swiper-wrapper">
              {articles.map((a, i) => {
                a = a.node
                const date = a.date.split("/")
                return (
                  <article className="swiper-slide" key={`articles-slide-${i}`}>
                    <Link to={`/articles/${a.slug}`}>
                      <div className="thumbnail">
                        <Img
                          fixed={
                            a.acf.featured_image.localFile.childImageSharp.fixed
                          }
                        />
                      </div>
                      <div className="content">
                        <h4 title={a.title}>{a.title}</h4>
                        <p>{`${date[0]} ${getMonth(date[1])} ${date[2]}`}</p>
                      </div>
                    </Link>
                    <div className="tags">
                      {a.categories.map((c, j) => {
                        const cat = getItemById(
                          c.id,
                          data.allWordpressCategory.edges
                        )
                        if (cat.wordpress_parent !== 0) return
                        if (cat.acf === null) return
                        const catClasses = classNames("tag", cat.acf.type)
                        return (
                          <div
                            href={`/articles?${
                              cat.acf.type === "informatif" ? "cat" : "c"
                            }=${cat.slug}`}
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

        <section className="about">
          <div className="content">
            <h2
              dangerouslySetInnerHTML={{ __html: data.wordpressPage.title }}
            ></h2>
            <span
              dangerouslySetInnerHTML={{ __html: data.wordpressPage.content }}
            ></span>
          </div>
          <div className="picture">
            <Img
              fluid={
                data.wordpressPage.acf.picture.localFile.childImageSharp.fluid
              }
            />
          </div>
        </section>

        <section className="section-categories">
          <h3>Continents</h3>
          <div className="continents">
            {this.getContinents().map((c, i) => {
              return (
                <div className="continent" key={`categories-continent-${i}`}>
                  <div className="overlay"></div>
                  <div className="thumbnail">
                    <Img
                      fluid={
                        c.node.acf.thumbnail.localFile.childImageSharp.fluid
                      }
                    />
                  </div>
                  <h5>{c.node.name}</h5>
                </div>
              )
            })}
          </div>
          <h3 className="text-center">Categories</h3>
          <div className="others">
            <div className="categories">
              {this.getCategories().map((c, i) => {
                return (
                  <div className="categorie" key={`categories-categ-${i}`}>
                    <div className="thumbnail">
                      <Img
                        fluid={
                          c.node.acf.thumbnail.localFile.childImageSharp.fluid
                        }
                      />
                    </div>
                    <h5>{c.node.name}</h5>
                  </div>
                )
              })}
            </div>
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
                  fixed(width: 680) {
                    ...GatsbyImageSharpFixed
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
                  fluid(maxWidth: 680) {
                    ...GatsbyImageSharpFluid
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
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
