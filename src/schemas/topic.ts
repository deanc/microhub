import * as Yup from "yup"

export const topicSchema = Yup.object({
  title: Yup.string().required().min(7).max(100),
  content: Yup.string().required().min(20).max(10000),
}).defined()
