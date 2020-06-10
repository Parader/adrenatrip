import React from "react"
import Img from "gatsby-image"
import Zoom from "react-medium-image-zoom"

const wrapperStyle = {
  // width: "auto",
  maxHeight: "100%",
  minHeight: "100%",
  // maxWidth: "100%",
}

const Image = ({ fluid, alt, isZoomable = true, ...props }) => {
  return fluid && isZoomable ? (
    <Zoom
      zoomMargin={40}
      overlayBgColorEnd={"rgba(255, 255, 255, 0.65)"}
      wrapStyle={wrapperStyle}
    >
      <Img style={wrapperStyle} fluid={fluid} alt={alt} {...props} />
    </Zoom>
  ) : (
    <Img style={wrapperStyle} fluid={fluid} alt={alt} {...props} />
  )
}

export default Image
