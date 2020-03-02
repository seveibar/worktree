// @flow weak

const micro = require("micro")
const getDB = require("../db")

let db
module.exports = async (req, res) => {
  if (!db) db = await getDB()
  const [accountId] = await db("account")
    .insert({})
    .returning("account_id")

  const newAccount = await db("account")
    .where({ account_id: accountId })
    .first()

  const newAPIKey = await db("account_api_key")
    .where({ account_id: accountId })
    .first()

  res.status(200).end(
    JSON.stringify({
      account_id: newAccount.account_id,
      default_api_key: newAPIKey.key_string
    })
  )
}
