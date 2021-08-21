import test from "ava"
import getDB from "~/tests/fixtures/db"

test("should create an account", async (t) => {
  const db = await getDB()
  const [account_id] = await db("account").insert({}).returning("account_id")
  t.assert(account_id)
  const apiKey = await db("account_api_key")
    .where("account_id", account_id)
    .first()
  t.assert(apiKey)
  await db.destroy()
})
