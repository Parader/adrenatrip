const stripHtml = html => {
  if (typeof window !== `undefined`) {
    let tmp = document.createElement("DIV")
    tmp.innerHTML = html

    return tmp.textContent || tmp.innerText || ""
  }
  return html
}

export default stripHtml
