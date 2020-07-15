import { Link, StaticQuery, graphql, navigate } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Logo from "./logo"
import classNames from "classnames"
import { Menu } from "antd"
import { InstagramOutlined, MailOutlined } from "@ant-design/icons"

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeMenu: [],
      isMobileOpen: false,
      isMobileOpenKey: 0,
    }
    this.scrollListener = null
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
    } else if (location.pathname.includes("/articles/")) {
      activeMenu = "item_6"
    }
    this.setState({ activeMenu })
  }

  handleMenuClick = val => {
    this.setState({ activeMenu: val.keyPath })
    if (val.keyPath[0] === "item_1") {
      window.localStorage.removeItem("filtersTrace")
      if (this.props.location.pathname === "/articles/")
        window.location.reload(false)
    }
  }

  handleMenuOpen = e => {
    this.setState({
      isMobileOpen: !this.state.isMobileOpen,
    })
    if (!this.state.isMobileOpen && !this.scrollListener) {
      this.scrollListener = document.addEventListener(
        "scroll",
        this.closePopupMenu
      )
    }
    if (this.state.isMobileOpen) {
      document.removeEventListener("scroll", this.closePopupMenu)
    }
  }

  closePopupMenu = () => {
    if (this.state.isMobileOpen) {
      this.setState({
        isMobileOpen: false,
        isMobileOpenKey: Math.random().toString(),
      })
      document.removeEventListener("scroll", this.closePopupMenu)
    }
  }

  handleLogoClick = () => {
    this.setState({ activeMenu: ["item_0"] })
  }

  handleMobileMenuClick = () => {}

  render() {
    const { location } = this.props
    const headerClasses = classNames("", {
      home: location.pathname === "/",
    })
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
                  overflowedIndicator={"MENU"}
                  onOpenChange={this.handleMenuOpen}
                  key={this.state.isMobileOpenKey}
                >
                  <Menu.Item
                    onClick={() => {
                      navigate("/")
                    }}
                  >
                    <Link to={"/"} className="underline-hover">
                      Accueil
                    </Link>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      navigate("/articles")
                    }}
                  >
                    <Link to={"/articles"} className="underline-hover">
                      Articles
                    </Link>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      navigate("/liens-utiles")
                    }}
                  >
                    <Link to={"/liens-utiles"} className="underline-hover">
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
                      <span className="label">Instagram</span>
                    </a>
                  </Menu.Item>
                  <Menu.Item className="icon">
                    <a
                      href={`mailto:${email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MailOutlined />
                      <span className="label">Email</span>
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
