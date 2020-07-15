import React from "react"
import { Link, navigate } from "gatsby"
import classNames from "classnames"
import Img from "../components/image"
import {
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  DoubleRightOutlined,
} from "@ant-design/icons"

const PostFooter = ({ currentPost, nextPost, handleCategoryClick }) => {
  return (
    <div className="post-footer">
      <div className="categories">
        {currentPost.categories.map((c, i) => {
          if (c.name === "Uncategorized") return
          const catClasses = classNames("category", c.acf.type)
          return (
            <a
              href={`#${c.slug}|${c.acf.type === "informatif" ? "i" : "g"}`}
              className={catClasses}
              key={`article-footer-categ-${i}`}
              onClick={handleCategoryClick}
            >
              {c.name}
            </a>
          )
        })}
      </div>
      <div className="group">
        <div className="share-buttons">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.facebook.com/sharer/sharer.php?u=${currentPost.url}`}
          >
            <FacebookFilled />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://twitter.com/home?status=${currentPost.url}`}
          >
            <TwitterSquareFilled />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentPost.url}&title=&summary=&source=`}
          >
            <LinkedinFilled />
          </a>
        </div>
        {nextPost && (
          <div
            className="next-post"
            onClick={() => {
              navigate(nextPost.url)
            }}
          >
            <Link to={nextPost.url}>
              Article suivant <DoubleRightOutlined />
            </Link>
            <div className="next-thumb">
              <Img
                fixed={nextPost.thumbnail.localFile.childImageSharp.fixed}
                isZoomable={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostFooter
