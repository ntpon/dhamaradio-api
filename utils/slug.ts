export const strToSlug = (str: string) => {
  return str
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace("%", "เปอร์เซนต์") // Translate some charactor
    .replace(/[^\u0E00-\u0E7F\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "")
}
