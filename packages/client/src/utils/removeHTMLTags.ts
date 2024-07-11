export const removeHTMLTags = (str: string) => {
  return str.replace(/<[^>]*>?/gm, "").replace(/&[A-z]{0,5};/, "")
}
