import React from "react"
import { Link } from "gatsby"
import TweenOne from "rc-tween-one"
import SEO from "../components/seo"
import { Layout } from "antd"

const { Content } = Layout

class NotFoundPage extends React.Component {
  render() {
    const { location } = this.props

    const fadeIn = {
      y: 0,
      opacity: 1,
      duration: 200,
      delay: 200,
    }
    return (
      <div className="page page-404">
        <SEO title="404 Not found" location={location} />
        <div className={`page page-404`}>
          <Content className="content-wrapper">
            <div className="page-content">
              <TweenOne
                animation={fadeIn}
                style={{ transform: "translateY(10px)", opacity: 0 }}
              >
                <h2>Erreur 404</h2>
                <h1>Page introuvable</h1>
              </TweenOne>
              <TweenOne
                animation={{ ...fadeIn, delay: 300 }}
                style={{ transform: "translateY(10px)", opacity: 0 }}
              >
                <div>
                  <p>
                    L'adresse que vous essayez d'accèder n'existe pas ou à
                    changée.
                  </p>
                  <div className={"cta"}>
                    <Link to={`/articles`}>Retour aux articles</Link>
                  </div>
                </div>
              </TweenOne>
            </div>
          </Content>
        </div>
      </div>
    )
  }
}

export default NotFoundPage
