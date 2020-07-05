import React from "react"
import classnames from "classnames"

import Map from "./map"

class InteractiveMap extends React.Component {
  handleClick = e => {
    this.props.onClick(e.target.parentElement.parentElement, true)
  }

  render() {
    const { currentFilters } = this.props
    const mapClasses = classnames("interactive-map", {
      af: currentFilters.continents.find(f => f.node.name === "Afrique"),
      an: currentFilters.continents.find(
        f => f.node.name === "Amérique du nord"
      ),
      as: currentFilters.continents.find(
        f => f.node.name === "Amérique du sud"
      ),
      eu: currentFilters.continents.find(f => f.node.name === "Europe"),
      asie: currentFilters.continents.find(f => f.node.name === "Asie"),
      oceanie: currentFilters.continents.find(f => f.node.name === "Océanie"),
    })

    return (
      <div className={mapClasses}>
        <Map onClick={this.handleClick} />
      </div>
    )
  }
}

export default InteractiveMap
