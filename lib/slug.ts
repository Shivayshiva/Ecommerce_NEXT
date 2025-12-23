import slugify from "slugify"
import { nanoid } from "nanoid"

export function generateSlug(name: string) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  })

  return `${baseSlug}-${nanoid(6)}`
}
