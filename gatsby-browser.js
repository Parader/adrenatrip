import React from "react"
import Layout from "./src/components/layout"
import "typeface-roboto-slab"

export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>
}
