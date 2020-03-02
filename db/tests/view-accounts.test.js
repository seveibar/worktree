const test = require("ava")
const getDB = require("../")

test("should load an unowned public tree", async t => {
  const db = await getDB({ migrate: true, testMode: true, seed: true })

  await db.raw("SET ROLE api_user")
  await db.raw("SELECT set_config('request.header.apikey', 'KEY1', FALSE)")

  const accounts = await db("api.account")

  t.assert(accounts.length === 1)

  await db.destroy()
})
