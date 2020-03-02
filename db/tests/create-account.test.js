const test = require("ava")
const getDB = require("../")

test("should create an account", async t => {
  const db = await getDB({ migrate: true, testMode: true })

  const [account_id] = await db("account")
    .insert({})
    .returning("account_id")

  t.assert(account_id)

  const apiKey = await db("account_api_key")
    .where("account_id", account_id)
    .first()

  t.assert(apiKey)

  await db.destroy()
})
