import * as Yup from "yup"
const { connection, fetchOne, getConnection } = require("../helpers/mysql")

const uniqueHubName = Yup.string()
  .required()
  .min(4)
  .max(30)
  .test(
    "name",
    "hub name is taken", // expect an i18n message to be passed in
    async (value) => {
      try {
        const row = await fetchOne(
          connection,
          "SELECT id FROM hub WHERE name = ?",
          [value]
        )

        if (!row) {
          return true
        }

        return false
      } catch (e) {
        return false
      }
    }
  )

export const hubSchema = Yup.object({
  name: uniqueHubName,
  description: Yup.string().max(255).required(),
  public: Yup.number().min(0).max(1).required(),
}).defined()
