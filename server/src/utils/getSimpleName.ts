export default (name: string) => {
  return name.replace(/[\s-^ㆍ]/g, "").replace(/(\(.*\))/g, "")
}
