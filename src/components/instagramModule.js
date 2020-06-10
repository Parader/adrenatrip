import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "./image"

class InstagramModule extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    const { options } = this.props
    return (
      <div className="instagram-module">
        <div className="back">
          <StaticQuery
            query={graphql`
              query instaQuery {
                allInstaNode {
                  edges {
                    node {
                      caption
                      localFile {
                        childImageSharp {
                          fluid(maxWidth: 500) {
                            ...GatsbyImageSharpFluid
                          }
                          grayscale: fluid(maxWidth: 500, grayscale: true) {
                            ...GatsbyImageSharpFluid
                          }
                        }
                      }
                    }
                  }
                }
              }
            `}
            render={data => {
              return (
                <div className="gallery">
                  {data.allInstaNode.edges.map((el, i) => {
                    return (
                      <div
                        className={`pic pic-${i} ${i % 2 && "odd"}`}
                        key={`insta-pic-${i}`}
                      >
                        <div className="content">
                          <Img
                            fluid={el.node.localFile.childImageSharp.grayscale}
                            isZoomable={false}
                          />
                          <Img
                            fluid={el.node.localFile.childImageSharp.fluid}
                            className="original"
                            isZoomable={false}
                          />
                          <p className="caption">{el.node.caption}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }}
          />
        </div>
        <div className="front">
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: options.news_band_text }}
          ></div>
        </div>
      </div>
    )
  }
}

export default InstagramModule
