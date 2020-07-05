import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Img from "./image"
import { InstagramOutlined } from "@ant-design/icons"
import classNames from "classnames"
import VisibilitySensor from "react-visibility-sensor"

class InstagramModule extends React.Component {
  render() {
    const { options } = this.props
    let visibilityCounter = 0
    return (
      <div className="instagram-module">
        <VisibilitySensor>
          {({ isVisible }) => {
            if (visibilityCounter < 1 && isVisible) visibilityCounter = 1
            const classes = classNames("visibility-sensor fader", {
              isVisible: visibilityCounter > 0,
            })
            return <div className={classes} style={{ height: "1px" }}></div>
          }}
        </VisibilitySensor>
        <div className="back">
          <StaticQuery
            query={graphql`
              query instaQuery {
                allInstaNode {
                  edges {
                    node {
                      id
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
                        className={`pic fader pic-${i} ${i % 2 && "odd"}`}
                        key={`insta-pic-${i}`}
                        style={{ "--anim-order": 12 - i }}
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
                          <div className="caption">
                            <p>{`${el.node.caption.substring(0, 72)}...`}</p>
                            <a
                              href={`https://instagram.com/p/${el.node.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <InstagramOutlined />
                            </a>
                          </div>
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
