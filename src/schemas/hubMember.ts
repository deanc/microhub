import * as Yup from "yup"

export const hubMemberSchema = Yup.object({
  username: Yup.string().required(),
}).defined()
