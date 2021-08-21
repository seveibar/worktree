import test from "ava"
import getDB from "~/tests/fixtures/db"

test("should load an unowned public tree", async (t) => {
  const db = await getDB()

  await db.raw("SET ROLE api_user")
  await db.raw("SELECT set_config('request.header.apikey', 'KEY1', FALSE)")

  const accounts = await db("api.account")

  t.assert(accounts.length === 1)

  await db.destroy()
})
