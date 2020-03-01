const test = require("ava")
const getDB = require("../")

test("should create an account", async t => {
  const db = await getDB({ migrate: true, testMode: true })

  const [account] = await db("account")
    .insert({})
    .returning("account_id")

  t.assert(account.account_id !== null)

  await db.destroy()
})
