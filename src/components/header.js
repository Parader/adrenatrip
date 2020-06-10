import { Link, StaticQuery, graphql, navigate } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Logo from "./logo"
import classNames from "classnames"
import { Layout, Menu, Breadcrumb } from "antd"
import { InstagramOutlined, MailOutlined } from "@ant-design/icons"
const { Header: HeadLayout, Content } = Layout

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeMenu: [],
    }
  }

  componentDidMount() {
    this.setActiveMenu()
  }

  componentDidUpdate(oldProps) {
    if (oldProps.location.pathname !== this.props.location.pathname) {
      this.setActiveMenu()
    }
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

  handleMenuClick = val => {
    this.setState({ activeMenu: val.keyPath })
  }

  handleLogoClick = () => {
    this.setState({ activeMenu: ["item_0"] })
  }

  render() {
    const { location } = this.props
    const headerClasses = classNames({ home: location.pathname === "/" })
    return (
      <StaticQuery
        query={graphql`
          query HeadingQuery {
            allWordpressAcfOptions {
              edges {
                node {
                  options {
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
          } = data.allWordpressAcfOptions.edges[0].node.options
          return (
            <header className={headerClasses}>
              <div className="logo">
                <Link to="/" onClick={this.handleLogoClick}>
                  <Logo />
                </Link>
              </div>
              <div className="menu">
                <Menu
                  theme="light className='icon'"
                  mode="horizontal"
                  selectable
                  onClick={this.handleMenuClick}
                  selectedKeys={this.state.activeMenu}
                >
                  <Menu.Item
                    onClick={() => {
                      navigate("/")
                      console.log("link click")
                    }}
                  >
                    <Link to={"/"}>Accueil</Link>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      navigate("/articles")
                      console.log("link click")
                    }}
                  >
                    <Link to={"/articles"}>Articles</Link>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      navigate("/liens-utiles")
                      console.log("link click")
                    }}
                  >
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
              </div>
            </header>
          )
        }}
      />
    )
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
