import React from "react"
import { Select } from "antd"
import _ from "lodash"
import classnames from "classnames"
import InteractiveMap from "../components/interactiveMap"
import { Input } from "antd"
import { PoweroffOutlined } from "@ant-design/icons"
import queryString from "query-string"
const { Search } = Input

const { Option } = Select

class Filters extends React.Component {
  constructor(props) {
    super(props)

    this.isFirstClickContinent = !props.location.search.includes("c=")
    this.isFirstClickCategorie = !props.location.search.includes("cat=")
  }

  handleSearchUpdate = e => {
    const { tools } = this.props
    const currentValue = e.target.value
    const keywords = _.without(currentValue.split(" "), "")
    tools.updateFilters("keywords", keywords)
  }

  handleCategoryClick = (e, fromMap = false) => {
    const { currentFilters, tools } = this.props
    const type = fromMap
      ? e.getAttribute("data-filter")
      : e.target.getAttribute("data-filter")
    const value = fromMap
      ? e.getAttribute("data-value")
      : e.target.getAttribute("data-value")
    let newFilter = null
    if (type === "continents" && this.isFirstClickContinent) {
      this.isFirstClickContinent = false
      newFilter = [value]
    } else if (type === "categories" && this.isFirstClickCategorie) {
      this.isFirstClickCategorie = false
      newFilter = [value]
    } else if (currentFilters[type]) {
      newFilter =
        currentFilters[type].filter(c => c.node.name === value).length > 0
          ? currentFilters[type].filter(f => f.node.name !== value)
          : [value, ...currentFilters[type]]
    }

    tools.updateFilters(type, newFilter)
  }

  handleToggleAll = type => {
    const { currentFilters, tools } = this.props
    const el =
      type === "categories" ? tools.getCategories() : tools.getContinents()
    if (currentFilters[type].length < el.length) {
      if (type === "continents") this.isFirstClickContinent = true
      else this.isFirstClickCategorie = true
      tools.updateFilters(type, el)
    } else if (currentFilters[type].length === el.length) {
      tools.updateFilters(type, [])
    }
  }

  render() {
    const { currentFilters, tools, location } = this.props
    const continents = tools.getContinents()
    const categories = tools.getCategories()

    return (
      <>
        <InteractiveMap
          onClick={this.handleCategoryClick}
          currentFilters={currentFilters}
        />
        <div className="filters">
          <div className="keywords">
            <Search
              defaultValue={queryString.parse(location.search).s}
              placeholder="Recherche"
              allowClear
              onChange={this.handleSearchUpdate}
              style={{ width: 287 }}
            />
          </div>
          <div className="continents">
            {continents.map((cont, i) => {
              const contClasses = classnames("tag", {
                active:
                  currentFilters.continents.filter(
                    c => c.node.name === cont.node.name
                  ).length > 0,
              })
              return (
                <div
                  className={contClasses}
                  data-filter={"continents"}
                  data-value={cont.node.name}
                  onClick={this.handleCategoryClick}
                  key={`filter-cont-${i}`}
                >
                  {cont.node.name}
                </div>
              )
            })}
            <PoweroffOutlined
              onClick={() => {
                this.handleToggleAll("continents")
              }}
            />
          </div>
          <div className="categories">
            {categories.map((cat, i) => {
              const catClasses = classnames("tag", {
                active:
                  currentFilters.categories.filter(
                    c => c.node.name === cat.node.name
                  ).length > 0,
                [cat.node.acf.type]: cat.node.acf,
              })
              return (
                <div
                  className={catClasses}
                  data-filter={"categories"}
                  data-value={cat.node.name}
                  onClick={this.handleCategoryClick}
                  key={`filter-cont-${i}`}
                >
                  {cat.node.name}
                </div>
              )
            })}
            <PoweroffOutlined
              onClick={() => {
                this.handleToggleAll("categories")
              }}
            />
          </div>
        </div>
      </>
    )
  }
}

export default Filters
