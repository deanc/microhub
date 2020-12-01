import * as Yup from "yup"

export const commentSchema = Yup.object({
  content: Yup.string().required().min(20).max(10000),
}).defined()
