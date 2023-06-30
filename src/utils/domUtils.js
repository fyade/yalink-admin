export const setHighlightHtml = (filterVal, html) => {
  if (!!html) {
    const reg = new RegExp(filterVal, 'gi')
    return html.replace(reg, `<span style="color: red;">${html}</span>`)
  }
  return html
}