import DOMPurify from "dompurify"
import Autolinker from "autolinker"
import { options as autoLinkerOptions, customLinker } from "./autolinker"

const allowedTags = ["a"]

export const purify = (value: string): string => {
  return value
  const cleanValue = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ["href"],
  })
  return cleanValue
}

export const nl2br = (str: string): string => str.replace(/[\r\n]/gi, "<br>")

export const parseUserContent = (content: string) =>
  customLinker(Autolinker.link(nl2br(purify(content)), <any>autoLinkerOptions))
