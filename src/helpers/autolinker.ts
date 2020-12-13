import { hubPrefix } from "./routes"

export const options = {
  urls: {
    schemeMatches: true,
    wwwMatches: false,
    tldMatches: false,
  },
  email: false,
  phone: false,
  mention: false,
  hashtag: false,

  stripPrefix: false,
  stripTrailingSlash: true,
  newWindow: true,

  truncate: {
    length: 0,
    location: "end",
  },

  className: "",
}

export const customLinker = (content: string): string => {
  const re = `(\/${hubPrefix}\/[a-z\\d]+-\\d+)`
  return content.replace(new RegExp(re, "gi"), `<a href="$1">$1</a>`)
}
