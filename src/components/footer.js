import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import Map from "./map"
import { Layout, Menu, Breadcrumb } from "antd"
import { InstagramOutlined, MailOutlined } from "@ant-design/icons"

class Footer extends React.Component {
  constructor(props) {
    super(props)
    let activeMenu = "item_0"
    if (props.location.pathname.includes("/articles")) {
      activeMenu = "item_1"
    } else if (props.location.pathname.includes("/liens")) {
      activeMenu = "item_2"
    }

    this.state = {
      activeMenu: [activeMenu],
    }
  }

  handleMenuClick = val => {
    this.setState({ activeMenu: val.keyPath })
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

          return (
            <footer>
              <div className="map">
                <Map />
              </div>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: texte_footer }}
              ></div>
              <nav className="footer-menu">
                <Menu
                  theme="light className='icon'"
                  mode="horizontal"
                  selectable
                  onClick={this.handleMenuClick}
                  selectedKeys={this.state.activeMenu}
                >
                  <Menu.Item>
                    <Link
                      to={"/"}
                      onClick={() => {
                        console.log("link click")
                      }}
                    >
                      Accueil
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to={"/articles"}>Articles</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to={"/liens-utiles"}>Liens Utiles</Link>
                  </Menu.Item>
                  <Menu.Item className="icon">
                    <a href={instagram} target="_blank">
                      <InstagramOutlined />
                    </a>
                  </Menu.Item>
                  <Menu.Item className="icon">
                    <a href={`mailto:${email}`} target="_blank">
                      <MailOutlined />
                    </a>
                  </Menu.Item>
                </Menu>
              </nav>
              <div className="copyrights">
                © {new Date().getFullYear()} - Adrenatrip
              </div>
            </footer>
          )
        }}
      />
    )
  }
}

export default Footer
