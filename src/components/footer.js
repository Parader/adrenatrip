import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import Map from "./map"
import { Menu } from "antd"
import { InstagramOutlined, MailOutlined } from "@ant-design/icons"
import VisibilitySensor from "react-visibility-sensor"
import classNames from "classnames"

class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeMenu: [],
    }
  }

  componentDidMount() {
    this.setActiveMenu()
  }

  handleMenuClick = val => {
    this.setState({ activeMenu: val.keyPath })
  }

  setActiveMenu = () => {
    const { location } = this.props
    let activeMenu = "item_0"
    if (location.pathname === "/articles") {
      activeMenu = "item_1"
    } else if (location.pathname.includes("/liens")) {
      activeMenu = "item_2"
    }
    this.setState({ activeMenu })
  }

  componentDidUpdate(oldProps) {
    if (oldProps.location.pathname !== this.props.location.pathname) {
      this.setActiveMenu()
    }
  }

  render() {
    return (
      <StaticQuery
        query={graphql`
          query FootingQuery {
            allWordpressAcfOptions {
              edges {
                node {
                  options {
                    texte_footer
                    instagram
                    email
                  }
                }
              }
            }
          }
        `}
        render={data => {
          const {
            instagram,
            email,
            texte_footer,
          } = data.allWordpressAcfOptions.edges[0].node.options
          let counter = 0
          return (
            <footer>
              <VisibilitySensor partialVisibility>
                {({ isVisible }) => {
                  const classes = classNames("fader", {
                    isVisible: isVisible || counter > 0,
                  })
                  if (isVisible && counter < 1) {
                    counter = 1
                  }
                  return [
                    <div
                      className={classes + " map"}
                      style={{ "--anim-order": "1" }}
                      key="0"
                    >
                      <Map />
                    </div>,
                    <div
                      className={classes + " content"}
                      style={{ "--anim-order": "2" }}
                      key="1"
                      dangerouslySetInnerHTML={{ __html: texte_footer }}
                    ></div>,
                    <nav
                      className={classes + " footer-menu"}
                      style={{ "--anim-order": "3" }}
                      key="2"
                    >
                      <Menu
                        theme="light className='icon'"
                        mode="horizontal"
                        selectable
                        onClick={this.handleMenuClick}
                        selectedKeys={this.state.activeMenu}
                      >
                        <Menu.Item>
                          <Link to={"/"} className="underline-hover">
                            Accueil
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link to={"/articles"} className="underline-hover">
                            Articles
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            to={"/liens-utiles"}
                            className="underline-hover"
                          >
                            Liens Utiles
                          </Link>
                        </Menu.Item>
                        <Menu.Item className="icon">
                          <a
                            href={instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <InstagramOutlined />
                          </a>
                        </Menu.Item>
                        <Menu.Item className="icon">
                          <a
                            href={`mailto:${email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MailOutlined />
                          </a>
                        </Menu.Item>
                      </Menu>
                    </nav>,
                    <div className="mobile" key="3">
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramOutlined />
                      </a>
                      <a
                        href={`mailto:${email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MailOutlined />
                      </a>
                    </div>,
                    <div
                      className={classes + " copyrights"}
                      style={{ "--anim-order": "4" }}
                      key="4"
                    >
                      © {new Date().getFullYear()} - Adrenatrip
                    </div>,
                  ]
                }}
              </VisibilitySensor>
            </footer>
          )
        }}
      />
    )
  }
}

export default Footer
