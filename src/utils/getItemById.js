const getItemById = (id, items) => {
  let item = null
  let found = false
  let i = 0
  while (found === false) {
    if (items[i].node.id === id) {
      found = true
      item = items[i].node
    }
    i++
    if (i > items.length) {
      found = true
      console.log("ID NOT FOUND")
    }
  }
  return item
}

export default getItemById
