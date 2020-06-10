import React from "react"
import { Link, navigate } from "gatsby"

import Image from "../components/image"
import Filters from "../components/filters"
import SEO from "../components/seo"
import { Button } from "antd"
import Logo from "../components/logo"
import Swiper from "swiper"
import Img from "gatsby-image"
import { LeftOutlined, RightOutlined, UpOutlined } from "@ant-design/icons"
import _ from "lodash"
import * as basicScroll from "basicscroll"
import classNames from "classnames"
import getItemById from "../utils/getItemById"
import getMonth from "../utils/getMonth"
import queryString from "query-string"
import InstagramModule from "../components/instagramModule"

class ArticlesPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filters: {
        keywords: [],
        continents: [],
        categories: [],
        pays: [],
      },
      pagination: 1,
    }
  }

  componentDidMount() {
    this.initFilters()
  }

  initFilters = () => {
    const { location } = this.props
    const hasParams =
      location.href.includes("cat=") ||
      location.href.includes("c=") ||
      location.href.includes("s=")

    const { cat, c, s } = queryString.parse(location.search)

    let urlCategories = false,
      urlContinents = false,
      urlKeywords = false

    if (cat) {
      urlCategories = this.getCategories().filter(c => {
        return cat.includes(c.node.slug)
      })
    }
    if (c) {
      urlContinents = this.getContinents().filter(cont => {
        return c.includes(cont.node.slug)
      })
    }
    if (s) {
      urlKeywords = s.split(",")
    }

    this.setState({
      filters: {
        keywords: urlKeywords ? urlKeywords : [],
        continents: urlContinents ? urlContinents : this.getContinents(),
        categories: urlCategories ? urlCategories : this.getCategories(),
        // pays: this.getPays(),
      },
    })
  }

  componentDidUpdate(oldProps) {
    if (oldProps.location.search !== this.props.location.search) {
      this.initFilters()
    }
  }

  resetFilters = type => {
    if (type === "categories") {
      this.setState({
        filters: {
          ...this.state.filters,
          categories: this.getCategories(),
        },
      })
    } else if (type === "continents") {
      this.setState({
        filters: {
          ...this.state.filters,
          continents: this.getContinents(),
        },
      })
    }
  }

  handleCategoryClick = e => {
    e.stopPropagation()
    e.preventDefault()
    e.persist()
    console.log(e.target.getAttribute("href"))
    setTimeout(() => {
      navigate(e.target.getAttribute("href"))
    }, 0)
    // navigate(to)
  }

  resizeWindow = () => {
    for (let i = 0; i < this.basicScrolls.length; i++) {
      this.basicScrolls[i].calculate()
      this.basicScrolls[i].update()
    }
    this.articleSwiper.update()
  }

  getContinents = (filter = false) => {
    return this.props.data.allWordpressCategory.edges.filter((c, i) => {
      return filter
        ? filter.includes(c.node.name) &&
            c.node.acf &&
            c.node.acf.type === "geographique" &&
            c.node.wordpress_parent === 0
        : c.node.acf &&
            c.node.acf.type === "geographique" &&
            c.node.wordpress_parent === 0

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

  getPays = () => {
    return this.props.data.allWordpressCategory.edges.filter((c, i) => {
      return c.node.acf && c.node.wordpress_parent !== 0
    })
  }

  updateFilters = (key, value) => {
    const { data, location } = this.props
    const { categories, continents, keywords } = this.state.filters
    const newValue =
      key === "keywords"
        ? value
        : value &&
          value.map(v => {
            if (typeof v === "string") {
              return data.allWordpressCategory.edges.find(
                c => c.node.name === v
              )
            } else {
              return v
            }
          })
    this.setState({
      filters: Object.assign({}, this.state.filters, { [key]: newValue }),
    })
  }

  getFilteredArticles = (odd = false) => {
    const articles = this.props.data.allWordpressPost.edges
    const filters = this.state.filters
    const invalidArticles = []

    const validArticles = articles.reduce((sum, a, i) => {
      const articleSearchableContent = `${a.node.title.toLowerCase()} ${a.node.content.toLowerCase()}`
      const haveValidKeywordsOn =
        filters.keywords.length > 0
          ? filters.keywords.reduce((isValid, k) => {
              return articleSearchableContent.indexOf(k.toLowerCase()) > -1
                ? true
                : isValid
            }, false)
          : true
      const haveValidCatOn = !!a.node.categories.find(
        c => c.acf && c.acf.type === "informatif"
      )
        ? a.node.categories.reduce((isValid, c) => {
            const inCategory = !!filters.categories.find(
              f => f.node.name === c.name
            )
            return isValid ? isValid : inCategory
          }, false)
        : true
      const haveValidContinentOn = !!a.node.categories.find(
        c => c.acf && c.acf.type === "geographique"
      )
        ? a.node.categories.reduce((isValid, c) => {
            const inContinent = !!filters.continents.find(
              f => f.node.name === c.name
            )
            return isValid ? isValid : inContinent
          }, false)
        : true
      if (!haveValidCatOn || !haveValidContinentOn || !haveValidKeywordsOn) {
        invalidArticles.push(a)
      }
      return haveValidCatOn && haveValidContinentOn && haveValidKeywordsOn
        ? [...sum, a]
        : sum
    }, [])

    return odd ? invalidArticles : validArticles
  }

  getOtherArticles = () => {
    return this.getFilteredArticles(true)
  }

  nextPage = () => {
    this.setState({ pagination: this.state.pagination + 1 })
  }

  componentWillUnmount() {}

  render() {
    const { data, location } = this.props

    const articles = data.allWordpressPost.edges
    const allWordpressAcfOptions = data.allWordpressAcfOptions
    const filteredArticles = this.getFilteredArticles()
    const otherArticles = this.getOtherArticles()
    const maxArticles = this.state.pagination * 8
    let articleCount = 0

    return (
      <>
        <div className="page page-articles">
          <SEO title="Articles" />
          <Filters
            updateFilters={this.updateFilters}
            currentFilters={this.state.filters}
            tools={{
              getCategories: this.getCategories,
              getContinents: this.getContinents,
              updateFilters: this.updateFilters,
              resetFilters: this.resetFilters,
            }}
            location={location}
          />
          <div className="articles-list">
            {filteredArticles.length > 0 && (
              <div className="has-result">
                <p className="count">
                  {filteredArticles.length} article
                  {filteredArticles.length > 1 && "s"}
                </p>
                {filteredArticles.map((a, i) => {
                  articleCount++
                  const date = a.node.date.split("/")
                  return (
                    articleCount <= maxArticles && (
                      <Link
                        to={`/articles/${a.node.slug}`}
                        className="article"
                        key={`articles-list-item-${i}`}
                      >
                        <div className="thumbnail">
                          <Img
                            fixed={
                              a.node.acf.featured_image.localFile
                                .childImageSharp.fixed
                            }
                          />
                        </div>
                        <div className="content">
                          <h2>{a.node.title}</h2>
                          <p>{`${date[0]} ${getMonth(date[1])} ${date[2]}`}</p>
                          <div className="categories">
                            {a.node.categories.map((c, j) => {
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
                                    cat.acf.type === "geographique"
                                      ? "c"
                                      : "cat"
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
                        </div>
                      </Link>
                    )
                  )
                })}
              </div>
            )}

            {
              <div className="no-result">
                {filteredArticles.length > 0 &&
                  otherArticles.length > 0 &&
                  articleCount <= maxArticles && <p>Autres articles..</p>}
                {filteredArticles.length < 1 && (
                  <p>Aucun article ne correspond à votre recherche</p>
                )}
                {otherArticles.map((a, i) => {
                  articleCount++
                  const date = a.node.date.split("/")

                  return (
                    articleCount <= maxArticles && (
                      <Link
                        to={`/articles/${a.node.slug}`}
                        className="article"
                        key={`articles-list-item-${i}`}
                      >
                        <div className="thumbnail">
                          <Img
                            fixed={
                              a.node.acf.featured_image.localFile
                                .childImageSharp.fixed
                            }
                          />
                        </div>
                        <div className="content">
                          <h2>{a.node.title}</h2>
                          <p>{`${date[0]} ${getMonth(date[1])} ${date[2]}`}</p>
                          <div className="categories">
                            {a.node.categories.map((c, j) => {
                              const cat = getItemById(
                                c.id,
                                data.allWordpressCategory.edges
                              )
                              if (cat.wordpress_parent !== 0) return
                              if (cat.acf === null) return
                              const catClasses = classNames("tag", cat.acf.type)
                              return (
                                <div
                                  className={catClasses}
                                  key={`articles-slide-${i}-cat-${j}`}
                                  onClick={this.handleCategoryClick}
                                  href={`/articles?${
                                    cat.acf.type === "geographique"
                                      ? "c"
                                      : "cat"
                                  }=${cat.slug}`}
                                >
                                  {cat.name}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </Link>
                    )
                  )
                })}
              </div>
            }
            {articleCount > maxArticles && (
              <div className="view-more" onClick={this.nextPage}>
                Voir plus d'articles
              </div>
            )}
            <div className="retour">
              Retour en haut
              <UpOutlined />
            </div>
          </div>
        </div>

        <InstagramModule
          options={allWordpressAcfOptions.edges[0].node.options}
        />
      </>
    )
  }
}

export default ArticlesPage

export const ArticlesQuery = graphql`
  query articles {
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
            name
            wordpress_parent
            acf {
              type
            }
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
    allWordpressAcfOptions {
      edges {
        node {
          options {
            news_band_text
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
    allWordpressTag {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
